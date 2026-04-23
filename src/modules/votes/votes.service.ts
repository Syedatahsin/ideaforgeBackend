import { prisma } from '../../lib/prisma';
import { VoteType } from '../../generated/prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

class VoteService {
  /**
   * Cast a vote (Create or Update).
   */
  async castVote(userId: string, ideaId: string, type: VoteType) {
    // 1. Verify idea exists
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    // 2. Perform atomic upsert
    // userId_ideaId is the name of the unique constraint inprisma
    return await prisma.vote.upsert({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
      update: {
        type,
      },
      create: {
        userId,
        ideaId,
        type,
      },
    });
  }

  /**
   * Remove a vote.
   */
  async removeVote(userId: string, ideaId: string) {
    const existing = await prisma.vote.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    });

    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'Vote not found');
    }

    return await prisma.vote.delete({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    });
  }

  /**
   * Get vote statistics for an idea.
   */
  async getVoteStats(ideaId: string) {
    const counts = await prisma.vote.groupBy({
      by: ['type'],
      where: { ideaId },
      _count: {
        type: true,
      },
    });

    const upVotes = counts.find((c) => c.type === VoteType.UP)?._count.type || 0;
    const downVotes = counts.find((c) => c.type === VoteType.DOWN)?._count.type || 0;

    return {
      upVotes,
      downVotes,
      totalScore: upVotes - downVotes,
    };
  }

  /**
   * Get top voted ideas.
   */
  async getTopVotedIdeas(limit: number = 10) {
    // 1. Fetch all ideas with their votes
    const ideas = await prisma.idea.findMany({
      where: {
        status: 'APPROVED', // Only show approved ideas
      },
      include: {
        votes: true,
        category: true,
        user: {
          select: { id: true, name: true, image: true }
        }
      },
    });

    // 2. Calculate net score and sort
    const scoredIdeas = ideas.map((idea) => {
      const upVotes = idea.votes.filter((v) => v.type === VoteType.UP).length;
      const downVotes = idea.votes.filter((v) => v.type === VoteType.DOWN).length;
      const netScore = upVotes - downVotes;
      
      // Remove the full votes array from the response to save bandwidth
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { votes, ...ideaData } = idea;
      
      return {
        ...ideaData,
        upVotes,
        downVotes,
        netScore,
      };
    });

    // 3. Sort by netScore descending and take top limit
    return scoredIdeas
      .sort((a, b) => b.netScore - a.netScore)
      .slice(0, limit);
  }
}

export const VoteServiceInstance = new VoteService();
