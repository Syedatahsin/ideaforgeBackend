import { IdeaStatus } from '../../generated/prisma/client';

export interface IIdeaCreate {
  title: string;
  categoryId: string;
  problemStatement: string;
  solution: string;
  description: string;
  price?: number;
}

export interface IIdeaUpdate {
  title?: string;
  categoryId?: string;
  problemStatement?: string;
  solution?: string;
  description?: string;
  price?: number;
}

export interface IIdeaStatusUpdate {
  status: IdeaStatus;
  rejectFeedback?: string;
}

export interface IIdeaResponse {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  slug: string;
  problemStatement: string;
  solution: string;
  description: string;
  price: number;
  isPaid: boolean;
  status: IdeaStatus;
  rejectFeedback?: string | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
