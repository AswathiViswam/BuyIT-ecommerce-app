export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  user_name?: string;
  user_avatar?: string | null;
  created_at: string;
}

export interface ReviewStats {
  count: number;
  average: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export interface CreateReviewPayload {
  rating: number;
  title?: string;
  comment?: string;
}
