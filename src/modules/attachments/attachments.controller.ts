import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AttachmentServiceInstance } from './attachments.service';
import { uploadToCloudinary, mapMimetypeToType } from '../../utils/fileUpload';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const uploadAttachment = catchAsync(async (req: Request, res: Response) => {
  const { ideaId } = req.body;
  const file = req.file;

  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please upload a file');
  }

  if (!ideaId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Idea ID is required');
  }

  // 1. Upload to Cloudinary
  const cloudResponse = await uploadToCloudinary(file);

  // 2. Map type
  const type = mapMimetypeToType(file.mimetype);

  // 3. Save to DB
  const result = await AttachmentServiceInstance.addAttachment({
    ideaId,
    userId: req.user?.id,
    type,
    url: cloudResponse.secure_url,
    publicId: cloudResponse.public_id,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'File uploaded and attached successfully',
    data: result,
  });
});

const getIdeaAttachments = catchAsync(async (req: Request, res: Response) => {
  const result = await AttachmentServiceInstance.getAttachmentsByIdea(req.user?.id as string, req.params.ideaId as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Attachments fetched successfully',
    data: result,
  });
});

const deleteAttachment = catchAsync(async (req: Request, res: Response) => {
  await AttachmentServiceInstance.deleteAttachment(req.user?.id as string, req.params.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Attachment deleted successfully',
    data: null,
  });
});

export const AttachmentController = {
  uploadAttachment,
  getIdeaAttachments,
  deleteAttachment,
};
