import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    ideaId: z.string().cuid(),
    message: z.string().min(1).max(1000),
  }),
});

export const replyCommentSchema = z.object({
  body: z.object({
    ideaId: z.string().cuid(),
    message: z.string().min(1).max(1000),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    message: z.string().min(1).max(1000),
  }),
});

export const reportCommentSchema = z.object({
  body: z.object({
    reason: z.string().min(5).max(500),
  }),
});
