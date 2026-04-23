import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CommentServiceInstance } from './comments.service';
import httpStatus from 'http-status';

const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.createComment(req.user?.id as string, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

const replyToComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.replyToComment(req.user?.id as string, req.params.commentId as string, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Reply added successfully',
    data: result,
  });
});

const getCommentsByIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.getCommentsByIdea(req.params.ideaId as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.updateComment(req.user?.id as string, req.params.id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.deleteComment(req.user?.id as string, req.params.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

const hideComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.hideComment(req.params.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Comment hidden successfully',
    data: result,
  });
});

const restoreComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.restoreComment(req.params.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Comment restored successfully',
    data: result,
  });
});

const hardDeleteComment = catchAsync(async (req: Request, res: Response) => {
  await CommentServiceInstance.hardDeleteComment(req.params.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Comment permanently deleted',
    data: null,
  });
});

const getMyComments = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.getMyComments(req.user?.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Your comments retrieved successfully',
    data: result,
  });
});

const reportComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServiceInstance.reportComment(req.user?.id as string, req.params.id as string, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Review reported successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
  replyToComment,
  getCommentsByIdea,
  updateComment,
  deleteComment,
  hideComment,
  restoreComment,
  hardDeleteComment,
  getMyComments,
  reportComment,
};
