import { prisma } from '../../lib/prisma';
import { IIdeaCreate, IIdeaUpdate, IIdeaStatusUpdate } from './ideas.interface';
import { IdeaStatus } from '../../generated/prisma/client';
import { slugify } from '../../utils/slugify';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

class IdeaService {
  /**
   * Helper to check if a user has access to premium content of an idea.
   * Access is granted if:
   * 1. User is an ADMIN
   * 2. User is the OWNER of the idea
   * 3. Idea is FREE (isPaid: false)
   * 4. User has a SUCCESS payment for this idea
   */
  async checkIdeaAccess(userId: string | undefined, ideaId: string): Promise<boolean> {
    if (!userId) return false;

    // 1. Fetch idea and requester roles
    const [idea, requester] = await Promise.all([
      prisma.idea.findUnique({ where: { id: ideaId } }),
      prisma.user.findUnique({ where: { id: userId } })
    ]);

    if (!idea) throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');

    // 2. Admin access
    if (requester?.role === 'ADMIN') return true;

    // 3. Owner access
    if (idea.userId === userId) return true;

    // 4. Free content access
    if (!idea.isPaid) return true;

    // 5. Check for successful payment
    const payment = await prisma.payment.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId
        }
      }
    });

    return payment?.status === 'SUCCESS';
  }

  /**
   * Create a new idea with a unique slug.
   */
  async createIdea(userId: string, payload: IIdeaCreate) {
    let slug = slugify(payload.title);
    
    const existing = await prisma.idea.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    return await prisma.idea.create({
      data: {
        ...payload,
        userId,
        slug,
        status: IdeaStatus.DRAFT,
      },
      include: {
        category: true,
        user: true,
      },
    });
  }

  /**
   * Get all approved ideas with optional search and category filters.
   */
  async getAllApprovedIdeas(filters: { searchTerm?: string; categoryId?: string } = {}) {
    const { searchTerm, categoryId } = filters;

    const where: any = {
      status: IdeaStatus.APPROVED,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    return await prisma.idea.findMany({
      where,
      include: {
        category: true,
        user: {
          select: { id: true, name: true, image: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single idea by ID or Slug.
   */
  async getIdeaByIdOrSlug(identifier: string, userId?: string) {
    const idea = await prisma.idea.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!idea) {
      throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    // 1. Calculate access status
    const canAccessAttachments = await this.checkIdeaAccess(userId, idea.id);

    // 2. Increment view count (if not owner)
    if (userId !== idea.userId) {
      await prisma.idea.update({
        where: { id: idea.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return {
      ...idea,
      canAccessAttachments,
    };
  }

  /**
   * Update an idea if the requester is the owner.
   */
  async updateIdea(userId: string, id: string, payload: IIdeaUpdate) {
    const existing = await prisma.idea.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (existing.userId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only update your own ideas');
    }

    if (existing.status === IdeaStatus.APPROVED) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Approved ideas cannot be modified.');
    }

    const data: any = { ...payload };
    if (payload.title) {
      data.slug = slugify(payload.title);
    }

    return await prisma.idea.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an unpublished idea if the requester is the owner.
   */
  async deleteIdea(userId: string, id: string) {
    const existing = await prisma.idea.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (existing.userId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only delete your own ideas');
    }

    if (existing.status === IdeaStatus.APPROVED || existing.status === IdeaStatus.UNDER_REVIEW) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Cannot delete ideas that are approved or under review');
    }

    return await prisma.idea.delete({ where: { id } });
  }

  /**
   * Review process.
   */
  async submitForReview(userId: string, id: string) {
    const existing = await prisma.idea.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (existing.userId !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only submit your own ideas');
    }

    if (existing.status !== IdeaStatus.DRAFT && existing.status !== IdeaStatus.REJECTED) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Idea must be in DRAFT or REJECTED status to submit for review');
    }

    return await prisma.idea.update({
      where: { id },
      data: { status: IdeaStatus.UNDER_REVIEW },
    });
  }

  /**
   * Admin: Approve or Reject an idea.
   */
  async adminUpdateStatus(id: string, payload: IIdeaStatusUpdate) {
    const existing = await prisma.idea.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    return await prisma.idea.update({
      where: { id },
      data: {
        status: payload.status,
        rejectFeedback: payload.rejectFeedback ?? null,
      },
    });
  }
}

export const IdeaServiceInstance = new IdeaService();
