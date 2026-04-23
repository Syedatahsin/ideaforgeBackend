import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { VoteServiceInstance } from './votes.service';
import httpStatus from 'http-status';
import { VoteType } from '../../generated/prisma/client';

const upvote = catchAsync(async (req: Request, res: Response) => {
  const result = await VoteServiceInstance.castVote(req.user?.id as string, req.params.ideaId as string, VoteType.UP);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Upvoted successfully',
    data: result,
  });
});

const downvote = catchAsync(async (req: Request, res: Response) => {
  const result = await VoteServiceInstance.castVote(req.user?.id as string, req.params.ideaId as string, VoteType.DOWN);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Downvoted successfully',
    data: result,
  });
});

const removeVote = catchAsync(async (req: Request, res: Response) => {
  await VoteServiceInstance.removeVote(req.user?.id as string, req.params.ideaId as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Vote removed successfully',
    data: null,
  });
});

const getVoteStats = catchAsync(async (req: Request, res: Response) => {
  const result = await VoteServiceInstance.getVoteStats(req.params.ideaId as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Vote statistics retrieved successfully',
    data: result,
  });
});

const getTopVotedIdeas = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await VoteServiceInstance.getTopVotedIdeas(limit);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Top voted ideas retrieved successfully',
    data: result,
  });
});

export const VoteController = {
  upvote,
  downvote,
  removeVote,
  getVoteStats,
  getTopVotedIdeas,
};
