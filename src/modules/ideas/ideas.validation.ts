import { z } from 'zod';
import { IdeaStatus } from '../../generated/prisma/client';

export const createIdeaSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(150),
    categoryId: z.string().cuid(),
    problemStatement: z.string().min(20),
    solution: z.string().min(20),
    description: z.string().min(50),
    price: z.number().min(0).optional().default(0),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateIdeaSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(150).optional(),
    categoryId: z.string().cuid().optional(),
    problemStatement: z.string().min(20).optional(),
    solution: z.string().min(20).optional(),
    description: z.string().min(50).optional(),
    price: z.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const adminUpdateStatusSchema = z.object({
  body: z.object({
    status: z.enum([IdeaStatus.APPROVED, IdeaStatus.REJECTED]),
    rejectFeedback: z.string().optional(),
  }),
});
