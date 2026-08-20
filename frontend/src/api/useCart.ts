import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeCartItem } from "./cartApi";
import { useAuth } from "../context/AuthContext";
import type { AddToCartPayload, UpdateCartItemPayload, CartItem } from "../types/cart";

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 mins
  });

  const addMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateCartItemPayload) => updateCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const items: CartItem[] = cartQuery.data?.items || [];
  const totalItems: number = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice: number = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  return {
    cart: cartQuery.data,
    items,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    totalItems,
    totalPrice,
    addToCart: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateCartItem: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    removeCartItem: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    refetchCart: cartQuery.refetch,
  };
};
