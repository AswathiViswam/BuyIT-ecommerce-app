import React, { useState } from "react";
import { useReviews } from "../api/useReviews";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch } from "../store/hooks";
import { showToast } from "../store/slices/uiSlice";

interface ReviewsSectionProps {
  productId: number;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { reviews, stats, isLoading, submitReview, isSubmitting } = useReviews(productId);
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(showToast({ message: "Please log in to write a review", type: "info" }));
      return;
    }

    try {
      await submitReview({ rating, title, comment });
      setIsModalOpen(false);
      setTitle("");
      setComment("");
      setRating(5);
      dispatch(showToast({ message: "Review posted successfully!", type: "success" }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    }
  };

  const averageRating = stats?.average || 4.5;
  const totalReviews = stats?.count || reviews.length;

  return (
    <div className="space-y-8">
      {/* Header & Score Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6 text-center sm:text-left">
          <div>
            <span className="text-5xl font-black text-gray-900 dark:text-white block">
              {averageRating}
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg">
                  {star <= Math.round(averageRating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Based on {totalReviews} reviews
            </span>
          </div>

          {/* Breakdown bars */}
          <div className="hidden sm:flex flex-col gap-1 text-xs text-gray-500 min-w-[200px]">
            {[5, 4, 3, 2, 1].map((num) => {
              const count = stats?.breakdown?.[num as keyof typeof stats.breakdown] || 0;
              const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={num} className="flex items-center gap-2">
                  <span className="w-6 font-medium">{num} ★</span>
                  <div className="flex-grow h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-gray-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl transition shadow-md shadow-indigo-200 dark:shadow-none active:scale-95 text-sm"
        >
          ✍️ Write a Review
        </button>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Write a Customer Review</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2 text-3xl text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="hover:scale-125 transition-transform"
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-2">
                    {rating} out of 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent build quality and fast performance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Your Detailed Review
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share what you liked, how it performs, or any tips for other buyers..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="py-8 text-center text-gray-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-700 p-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No reviews yet for this product. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
          {reviews.map((rev : any) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    {rev.user_name ? rev.user_name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white block leading-none">
                      {rev.user_name || "Verified Customer"}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">✓ Verified Purchase</span>
                  </div>
                </div>

                <span className="text-xs text-gray-400">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>{star <= rev.rating ? "★" : "☆"}</span>
                ))}
                {rev.title && (
                  <span className="font-bold text-gray-900 dark:text-white ml-2 text-sm">
                    {rev.title}
                  </span>
                )}
              </div>

              {rev.comment && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {rev.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsSection;
