import api from "./axios";
import type { WishlistResponse } from "../types/wishlist";

export const getWishlist = async (): Promise<WishlistResponse> => {
  const response = await api.get<WishlistResponse>("/wishlist");
  return response.data;
};

export const addToWishlist = async (productId: number): Promise<WishlistResponse> => {
  const response = await api.post<WishlistResponse>("/wishlist", { productId });
  return response.data;
};

export const removeFromWishlist = async (productId: number): Promise<WishlistResponse> => {
  const response = await api.delete<WishlistResponse>(`/wishlist/${productId}`);
  return response.data;
};
