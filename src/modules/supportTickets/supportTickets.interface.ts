import { TicketCategory, TicketStatus } from "../../generated/prisma/client";

export interface ISupportTicketCreate {
  subject: string;
  message: string;
  category: TicketCategory;
}

export interface ISupportTicketUpdateStatus {
  status: TicketStatus;
}

export interface ISupportTicketAssign {
  assignedTo: string;
}

export interface ISupportTicketResponse {
  id: string;
  userId: string;
  assignedTo: string | null;
  subject: string;
  message: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}
