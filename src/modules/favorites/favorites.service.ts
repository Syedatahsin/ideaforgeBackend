import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

class FavoriteService {
  /**
   * Add an idea to user's favorites.
   */
  async addFavorite(userId: string, ideaId: string) {
    // 1. Verify idea exists
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    // 2. Create favorite (@@unique constraint handles duplicates)
    return await prisma.favorite.upsert({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
      update: {}, // Do nothing if it already exists
      create: {
        userId,
        ideaId,
      },
    });
  }

  /**
   * Remove an idea from user's favorites.
   */
  async removeFavorite(userId: string, ideaId: string) {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    });

    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, 'Favorite not found');
    }

    return await prisma.favorite.delete({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    });
  }

  /**
   * Get all favorites for the current user.
   */
  async getMyFavorites(userId: string) {
    return await prisma.favorite.findMany({
      where: { userId },
      include: {
        idea: {
          include: {
            category: true,
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const FavoriteServiceInstance = new FavoriteService();
