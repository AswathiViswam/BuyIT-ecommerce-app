import api from "./axios";
import type { ReviewsResponse, CreateReviewPayload, Review } from "../types/review";

export const getProductReviews = async (productId: number | string): Promise<ReviewsResponse> => {
  const response = await api.get<ReviewsResponse>(`/reviews/${productId}`);
  return response.data;
};

export const createReview = async (
  productId: number | string,
  payload: CreateReviewPayload
): Promise<{ message: string; review: Review }> => {
  const response = await api.post<{ message: string; review: Review }>(`/reviews/${productId}`, payload);
  return response.data;
};
