import { CommentStatus } from '../../generated/prisma/client';

export interface ICommentCreate {
  ideaId: string;
  message: string;
}

export interface ICommentReply {
  ideaId: string;
  message: string;
}

export interface ICommentUpdate {
  message: string;
}

export interface IReportComment {
  reason: string;
}

export interface ICommentResponse {
  id: string;
  userId: string;
  ideaId: string;
  parentId: string | null;
  message: string;
  status: CommentStatus;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: ICommentResponse[];
}
