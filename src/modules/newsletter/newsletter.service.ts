import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { NewsletterStatus } from '../../generated/prisma/client';

class NewsletterService {
  /**
   * Subscribe an email. (No login required).
   */
  async subscribe(email: string) {
    return await prisma.newsletter.upsert({
      where: { email },
      update: { status: NewsletterStatus.ACTIVE }, // Reactive if was unsubscribed
      create: {
        email,
        status: NewsletterStatus.ACTIVE,
      },
    });
  }

  /**
   * Unsubscribe an email.
   */
  async unsubscribe(email: string) {
    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found for this email');
    }

    return await prisma.newsletter.update({
      where: { email },
      data: { status: NewsletterStatus.UNSUBSCRIBED },
    });
  }

  /**
   * Get all subscribers (Admin only - optional for later).
   */
  async getAllSubscribers() {
    return await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const NewsletterServiceInstance = new NewsletterService();
