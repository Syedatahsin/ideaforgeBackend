import { ReportStatus } from '../../generated/prisma/client';

export interface IReportCreate {
  ideaId?: string;
  commentId?: string;
  reason: string;
}

export interface IReportStatusUpdate {
  status: ReportStatus;
}
