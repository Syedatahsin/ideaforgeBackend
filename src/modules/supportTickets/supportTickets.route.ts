import { Router } from 'express';
import { SupportTicketController } from './supportTickets.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createTicketSchema, updateTicketStatusSchema, assignTicketSchema } from './supportTickets.validation';

const router = Router();

// --- PROTECTED ROUTES (USER) ---
router.get('/me', authMiddleware(), SupportTicketController.getMyTickets);

router.post(
  '/', 
  authMiddleware(), 
  validateRequest(createTicketSchema), 
  SupportTicketController.createTicket
);

// --- ADMIN ROUTES ---
router.get('/', authMiddleware('ADMIN'), SupportTicketController.getAllTickets);

router.patch(
  '/:id/assign', 
  authMiddleware('ADMIN'), 
  validateRequest(assignTicketSchema), 
  SupportTicketController.assignTicket
);

router.patch(
  '/:id/status', 
  authMiddleware('ADMIN'), 
  validateRequest(updateTicketStatusSchema), 
  SupportTicketController.updateTicketStatus
);

export const SupportTicketRoutes = router;
