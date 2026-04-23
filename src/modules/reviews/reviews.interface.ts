export interface IReviewCreate {
  ideaId: string;
  rating: number; // 1-5
  comment?: string;
}

export interface IReviewUpdate {
  rating?: number;
  comment?: string;
}

export interface IReviewResponse {
  id: string;
  userId: string;
  ideaId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface IReviewStats {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    [key: number]: number;
  };
}
