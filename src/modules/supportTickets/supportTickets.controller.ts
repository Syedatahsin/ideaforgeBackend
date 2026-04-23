import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { SupportTicketServiceInstance } from './supportTickets.service';
import httpStatus from 'http-status';

const createTicket = catchAsync(async (req: Request, res: Response) => {
  const result = await SupportTicketServiceInstance.createTicket(req.user?.id as string, req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Ticket created successfully',
    data: result,
  });
});

const getMyTickets = catchAsync(async (req: Request, res: Response) => {
  const result = await SupportTicketServiceInstance.getMyTickets(req.user?.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Your tickets retrieved successfully',
    data: result,
  });
});

const getAllTickets = catchAsync(async (req: Request, res: Response) => {
  const result = await SupportTicketServiceInstance.getAllTickets();
  res.status(httpStatus.OK).json({
    success: true,
    message: 'All tickets retrieved successfully',
    data: result,
  });
});

const assignTicket = catchAsync(async (req: Request, res: Response) => {
  const result = await SupportTicketServiceInstance.assignTicket(req.params.id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Ticket assigned successfully',
    data: result,
  });
});

const updateTicketStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await SupportTicketServiceInstance.updateTicketStatus(req.params.id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: `Ticket status updated to ${req.body.status}`,
    data: result,
  });
});

export const SupportTicketController = {
  createTicket,
  getMyTickets,
  getAllTickets,
  assignTicket,
  updateTicketStatus,
};
