import { AttachmentType } from '../../generated/prisma/client';

export interface IAttachmentCreate {
  ideaId: string;
  userId?: string;
  type: AttachmentType;
  url: string;
  publicId: string; // Cloudinary public_id for deletion
}

export interface IAttachmentResponse {
  id: string;
  ideaId: string;
  userId: string | null;
  type: AttachmentType;
  url: string;
  createdAt: Date;
}
