import { z } from 'zod';
import { ReportStatus } from '../../generated/prisma/client';

export const reportSchema = z.object({
  body: z.object({
    reason: z.string().min(5).max(500),
  }),
});

export const updateReportStatusSchema = z.object({
  body: z.object({
    status: z.enum([ReportStatus.RESOLVED, ReportStatus.REJECTED]),
  }),
});
