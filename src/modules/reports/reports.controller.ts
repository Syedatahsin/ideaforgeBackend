import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ReportServiceInstance } from './reports.service';
import httpStatus from 'http-status';

const reportIdea = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportServiceInstance.createReport(req.user?.id as string, {
    ideaId: req.params.ideaId as string,
    reason: req.body.reason,
  });
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Idea reported successfully',
    data: result,
  });
});

const reportComment = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportServiceInstance.createReport(req.user?.id as string, {
    commentId: req.params.commentId as string,
    reason: req.body.reason,
  });
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Comment reported successfully',
    data: result,
  });
});

const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportServiceInstance.getAllReports();
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Reports retrieved successfully',
    data: result,
  });
});

const updateReportStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportServiceInstance.updateReportStatus(req.user?.id as string, req.params.id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: `Report status updated to ${req.body.status}`,
    data: result,
  });
});

export const ReportController = {
  reportIdea,
  reportComment,
  getAllReports,
  updateReportStatus,
};
