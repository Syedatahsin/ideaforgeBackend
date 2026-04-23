import { prisma } from '../../lib/prisma';
import { IReviewCreate, IReviewUpdate } from './reviews.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IdeaStatus } from '../../generated/prisma/client';

class ReviewService {
  /**
   * Create or Update a review. (One user per idea).
   */
  async upsertReview(userId: string, payload: IReviewCreate) {
    // 1. Verify idea exists and is APPROVED
    const idea = await prisma.idea.findUnique({
      where: { id: payload.ideaId },
    });

    if (!idea) {
      throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.status !== IdeaStatus.APPROVED) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You can only review approved ideas');
    }

    // 2. Atomic Upsert
    return await prisma.review.upsert({
      where: {
        userId_ideaId: {
          userId,
          ideaId: payload.ideaId,
        },
      },
      update: {
        rating: payload.rating,
        comment: payload.comment,
      },
      create: {
        userId,
        ideaId: payload.ideaId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });
  }

  /**
   * Update own review.
   */
  async updateReview(userId: string, id: string, payload: IReviewUpdate) {
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
    }

    if (review.userId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only edit your own reviews');
    }

    return await prisma.review.update({
      where: { id },
      data: payload,
    });
  }

  /**
   * Delete review.
   */
  async deleteReview(userId: string, id: string) {
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
    }

    if (review.userId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only delete your own reviews');
    }

    return await prisma.review.delete({ where: { id } });
  }

  /**
   * Get reviews for an idea with statistics.
   */
  async getIdeaReviews(ideaId: string) {
    const reviews = await prisma.review.findMany({
      where: { ideaId },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (reviews.length === 0) {
      return {
        reviews: [],
        stats: {
          averageRating: 0,
          totalReviews: 0,
          breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
      };
    }

    const totalReviews = reviews.length;
    const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = parseFloat((sumRating / totalReviews).toFixed(1));

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      breakdown[r.rating as keyof typeof breakdown]++;
    });

    return {
      reviews,
      stats: {
        averageRating,
        totalReviews,
        breakdown,
      },
    };
  }
}

export const ReviewServiceInstance = new ReviewService();
