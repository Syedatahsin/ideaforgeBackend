import { IdeaStatus } from "../../generated/prisma/client";

export interface IFavoriteResponse {
  id: string;
  userId: string;
  ideaId: string;
  createdAt: Date;
  idea: {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: IdeaStatus;
    category: {
      id: string;
      name: string;
    };
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}
