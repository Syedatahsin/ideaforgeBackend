import { prisma } from '../../lib/prisma';
import { IAttachmentCreate } from './attachments.interface';
import { v2 as cloudinary } from 'cloudinary';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

import { IdeaServiceInstance } from '../ideas/ideas.service';

class AttachmentService {
  /**
   * Add a new attachment record to the database.
   */
  async addAttachment(payload: IAttachmentCreate) {
    return await prisma.attachment.create({
      data: payload,
    });
  }

  /**
   * Fetch all attachments for a specific idea.
   * ACCESS RESTRICTED: Requires payment verification.
   */
  async getAttachmentsByIdea(userId: string | undefined, ideaId: string) {
    const hasAccess = await IdeaServiceInstance.checkIdeaAccess(userId, ideaId);

    if (!hasAccess) {
      throw new AppError(httpStatus.FORBIDDEN, 'You must purchase this idea to access its attachments');
    }

    return await prisma.attachment.findMany({
      where: { ideaId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete an attachment from DB and Cloudinary.
   */
  async deleteAttachment(userId: string, id: string) {
    const attachment = await prisma.attachment.findUnique({
      where: { id },
      include: { idea: true }
    });

    if (!attachment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Attachment not found');
    }

    // Only owner of the idea or the uploader can delete
    if (attachment.userId !== userId && attachment.idea.userId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to delete this attachment');
    }

    // 1. Delete from Cloudinary
    if (attachment.publicId) {
      await cloudinary.uploader.destroy(attachment.publicId);
    }

    // 2. Delete from DB
    return await prisma.attachment.delete({
      where: { id },
    });
  }
}

export const AttachmentServiceInstance = new AttachmentService();
