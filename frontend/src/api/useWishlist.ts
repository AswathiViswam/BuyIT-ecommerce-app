import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlist, addToWishlist, removeFromWishlist } from "./wishlistApi";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch } from "../store/hooks";
import { setWishlistIds, toggleWishlistId } from "../store/slices/wishlistSlice";
import type { WishlistResponse, WishlistItem } from "../types/wishlist";

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<WishlistResponse> => {
      const data = await getWishlist();
      dispatch(setWishlistIds(data.items.map((i: WishlistItem) => i.id)));
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: (productId: number) => addToWishlist(productId),
    onMutate: (productId: number) => {
      dispatch(toggleWishlistId(productId));
    },
    onSuccess: (data: WishlistResponse) => {
      queryClient.setQueryData(["wishlist"], data);
      dispatch(setWishlistIds(data.items.map((i: WishlistItem) => i.id)));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeFromWishlist(productId),
    onMutate: (productId: number) => {
      dispatch(toggleWishlistId(productId));
    },
    onSuccess: (data: WishlistResponse) => {
      queryClient.setQueryData(["wishlist"], data);
      dispatch(setWishlistIds(data.items.map((i: WishlistItem) => i.id)));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const items = wishlistQuery.data?.items || [];
  const count = wishlistQuery.data?.count || 0;

  return {
    wishlist: wishlistQuery.data,
    items,
    count,
    isLoading: wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    addToWishlist: addMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    refetchWishlist: wishlistQuery.refetch,
  };
};
