import { z } from 'zod';
import { TicketCategory, TicketStatus } from '../../generated/prisma/client';

export const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(5).max(100),
    message: z.string().min(10).max(2000),
    category: z.nativeEnum(TicketCategory),
  }),
});

export const updateTicketStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(TicketStatus),
  }),
});

export const assignTicketSchema = z.object({
  body: z.object({
    assignedTo: z.string().uuid().or(z.string().cuid()), // Support both uuid (better auth) and cuid
  }),
});
