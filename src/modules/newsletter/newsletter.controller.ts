import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { NewsletterServiceInstance } from './newsletter.service';
import httpStatus from 'http-status';

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterServiceInstance.subscribe(req.body.email);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Subscribed successfully',
    data: result,
  });
});

const unsubscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterServiceInstance.unsubscribe(req.body.email);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Unsubscribed successfully',
    data: result,
  });
});

export const NewsletterController = {
  subscribe,
  unsubscribe,
};
