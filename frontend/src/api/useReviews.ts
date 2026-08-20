import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductReviews, createReview } from "./reviewApi";
import type { CreateReviewPayload } from "../types/review";

export const useReviews = (productId: number | string | undefined) => {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviews(productId!),
    enabled: !!productId,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(productId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    reviews: reviewsQuery.data?.reviews || [],
    stats: reviewsQuery.data?.stats,
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    submitReview: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
  };
};
