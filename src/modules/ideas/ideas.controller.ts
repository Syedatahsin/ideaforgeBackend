import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { IdeaServiceInstance } from './ideas.service';
import httpStatus from 'http-status';

const createIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await IdeaServiceInstance.createIdea(req.user?.id as string, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Idea created successfully',
    data: result,
  });
});

const getAllApprovedIdeas = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm, categoryId } = req.query;
  const result = await IdeaServiceInstance.getAllApprovedIdeas({
    searchTerm: searchTerm as string,
    categoryId: categoryId as string,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Approved ideas fetched successfully',
    data: result,
  });
});

const getIdeaByIdOrSlug = catchAsync(async (req: Request, res: Response) => {
  const result = await IdeaServiceInstance.getIdeaByIdOrSlug(req.params.id as string, req.user?.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Idea fetched successfully',
    data: result,
  });
});

const updateIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await IdeaServiceInstance.updateIdea(req.user?.id as string, req.params.id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Idea updated successfully',
    data: result,
  });
});

const deleteIdea = catchAsync(async (req: Request, res: Response) => {
  await IdeaServiceInstance.deleteIdea(req.user?.id as string, req.params.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Idea deleted successfully',
    data: null,
  });
});

const submitForReview = catchAsync(async (req: Request, res: Response) => {
  const result = await IdeaServiceInstance.submitForReview(req.user?.id as string, req.params.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Idea submitted for review',
    data: result,
  });
});

const adminUpdateStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await IdeaServiceInstance.adminUpdateStatus(req.params.id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: `Idea status updated to ${req.body.status}`,
    data: result,
  });
});

export const IdeaController = {
  createIdea,
  getAllApprovedIdeas,
  getIdeaByIdOrSlug,
  updateIdea,
  deleteIdea,
  submitForReview,
  adminUpdateStatus,
};
