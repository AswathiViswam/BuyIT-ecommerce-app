import api from "./axios";
import type { CartResponse, AddToCartPayload, UpdateCartItemPayload, CartItem } from "../types/cart";

export const getCart = async (): Promise<CartResponse> => {
  const response = await api.get<CartResponse>("/cart");
  return response.data;
};

export const addToCart = async (payload: AddToCartPayload): Promise<{ message: string; item: CartItem }> => {
  const response = await api.post<{ message: string; item: CartItem }>("/cart", payload);
  return response.data;
};

export const updateCartItem = async ({ itemId, quantity }: UpdateCartItemPayload): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>(`/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (itemId: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/cart/${itemId}`);
  return response.data;
};
