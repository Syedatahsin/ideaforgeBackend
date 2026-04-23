import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ReviewServiceInstance } from './reviews.service';
import httpStatus from 'http-status';

const upsertReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServiceInstance.upsertReview(req.user?.id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServiceInstance.updateReview(req.user?.id as string, req.params.id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await ReviewServiceInstance.deleteReview(req.user?.id as string, req.params.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Review deleted successfully',
    data: null,
  });
});

const getIdeaReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServiceInstance.getIdeaReviews(req.params.ideaId as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

export const ReviewController = {
  upsertReview,
  updateReview,
  deleteReview,
  getIdeaReviews,
};
