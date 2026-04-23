import { prisma } from '../../lib/prisma';
import { ICommentCreate, ICommentUpdate, IReportComment, ICommentResponse } from './comments.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { CommentStatus } from '../../generated/prisma/client';

class CommentService {
  /**
   * Create a top-level comment on an idea.
   */
  async createComment(userId: string, payload: ICommentCreate) {
    return await prisma.comment.create({
      data: {
        ...payload,
        userId,
        status: CommentStatus.VISIBLE,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    });
  }

  /**
   * Create a reply to an existing comment.
   */
  async replyToComment(userId: string, parentId: string, payload: ICommentCreate) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });

    if (!parent) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parent comment not found');
    }

    return await prisma.comment.create({
      data: {
        ...payload,
        userId,
        parentId,
        status: CommentStatus.VISIBLE,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    });
  }

  /**
   * Get comments for an idea as a nested tree.
   */
  async getCommentsByIdea(ideaId: string): Promise<ICommentResponse[]> {
    const comments = await prisma.comment.findMany({
      where: {
        ideaId,
        status: { not: CommentStatus.HIDDEN }
      },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // --- Tree Building Algorithm (O(n)) ---
    const commentMap = new Map<string, ICommentResponse>();
    const rootComments: ICommentResponse[] = [];

    // 1. Initialize map with all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 2. Build relationships
    commentMap.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies?.push(comment);
        } else {
          // If parent is hidden or missing, treat as root or skip
          rootComments.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  /**
   * Update own comment.
   */
  async updateComment(userId: string, id: string, payload: ICommentUpdate) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    if (comment.userId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only edit your own comments');
    }

    if (comment.status !== CommentStatus.VISIBLE) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Deleted or hidden comments cannot be edited');
    }

    return await prisma.comment.update({
      where: { id },
      data: payload,
    });
  }

  /**
   * Soft delete own comment.
   */
  async deleteComment(userId: string, id: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    if (comment.userId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only delete your own comments');
    }

    return await prisma.comment.update({
      where: { id },
      data: {
        status: CommentStatus.DELETED,
        message: '[deleted]',
      },
    });
  }

  /**
   * Admin: Hide a comment.
   */
  async hideComment(id: string) {
    return await prisma.comment.update({
      where: { id },
      data: { status: CommentStatus.HIDDEN },
    });
  }

  /**
   * Admin: Restore a hidden comment.
   */
  async restoreComment(id: string) {
    return await prisma.comment.update({
      where: { id },
      data: { status: CommentStatus.VISIBLE },
    });
  }

  /**
   * Admin: Hard delete any comment.
   */
  async hardDeleteComment(id: string) {
    return await prisma.comment.delete({ where: { id } });
  }

  /**
   * Get comments created by the current user.
   */
  async getMyComments(userId: string) {
    return await prisma.comment.findMany({
      where: { userId },
      include: {
        idea: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Report a comment.
   */
  async reportComment(userId: string, id: string, payload: IReportComment) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    return await prisma.report.create({
      data: {
        reportedBy: userId,
        commentId: id,
        reason: payload.reason,
      }
    });
  }
}

export const CommentServiceInstance = new CommentService();
