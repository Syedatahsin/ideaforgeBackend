import { prisma } from '../../lib/prisma';
import { ISupportTicketCreate, ISupportTicketUpdateStatus, ISupportTicketAssign } from './supportTickets.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TicketStatus } from '../../generated/prisma/client';

class SupportTicketService {
  /**
   * Create a new support ticket.
   */
  async createTicket(userId: string, payload: ISupportTicketCreate) {
    return await prisma.supportTicket.create({
      data: {
        ...payload,
        userId,
        status: TicketStatus.OPEN,
      },
    });
  }

  /**
   * Get tickets belonging to the current user.
   */
  async getMyTickets(userId: string) {
    return await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all tickets (Admin/Support).
   */
  async getAllTickets() {
    return await prisma.supportTicket.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Assign a ticket to a support staff member.
   */
  async assignTicket(id: string, payload: ISupportTicketAssign) {
    const ticket = await prisma.supportTicket.findUnique({ where: { id } });

    if (!ticket) {
      throw new AppError(httpStatus.NOT_FOUND, 'Ticket not found');
    }

    return await prisma.supportTicket.update({
      where: { id },
      data: {
        assignedTo: payload.assignedTo,
        status: TicketStatus.IN_PROGRESS, // Auto move to In Progress when assigned
      },
    });
  }

  /**
   * Update ticket status.
   */
  async updateTicketStatus(id: string, payload: ISupportTicketUpdateStatus) {
    const ticket = await prisma.supportTicket.findUnique({ where: { id } });

    if (!ticket) {
      throw new AppError(httpStatus.NOT_FOUND, 'Ticket not found');
    }

    return await prisma.supportTicket.update({
      where: { id },
      data: {
        status: payload.status,
      },
    });
  }
}

export const SupportTicketServiceInstance = new SupportTicketService();
