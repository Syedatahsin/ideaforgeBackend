import { prisma } from '../../lib/prisma';
import { IReportCreate, IReportStatusUpdate } from './reports.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ReportStatus } from '../../generated/prisma/client';

class ReportService {
  /**
   * Create a report for an Idea or Comment.
   */
  async createReport(userId: string, payload: IReportCreate) {
    if (!payload.ideaId && !payload.commentId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Must provide either an Idea ID or a Comment ID');
    }

    // Verify existence
    if (payload.ideaId) {
      const idea = await prisma.idea.findUnique({ where: { id: payload.ideaId } });
      if (!idea) throw new AppError(httpStatus.NOT_FOUND, 'Idea to report not found');
    }

    if (payload.commentId) {
      const comment = await prisma.comment.findUnique({ where: { id: payload.commentId } });
      if (!comment) throw new AppError(httpStatus.NOT_FOUND, 'Comment to report not found');
    }

    return await prisma.report.create({
      data: {
        reportedBy: userId,
        ideaId: payload.ideaId,
        commentId: payload.commentId,
        reason: payload.reason,
        status: ReportStatus.PENDING,
      },
    });
  }

  /**
   * Get all reports (Admin).
   */
  async getAllReports() {
    return await prisma.report.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        // We link these manually if they exist
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update report status (Resolve/Reject).
   */
  async updateReportStatus(adminId: string, id: string, payload: IReportStatusUpdate) {
    const report = await prisma.report.findUnique({ where: { id } });

    if (!report) {
      throw new AppError(httpStatus.NOT_FOUND, 'Report not found');
    }

    return await prisma.report.update({
      where: { id },
      data: {
        status: payload.status,
        handledBy: adminId,
      },
    });
  }
}

export const ReportServiceInstance = new ReportService();
