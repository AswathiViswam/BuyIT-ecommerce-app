import api from "./axios";
import type { Product, ProductsResponse, ProductFilterParams } from "../types/product";

export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
}

export const getProducts = async (params?: ProductFilterParams): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/products", {
    params,
  });
  return response.data;
};

export const getProductById = async (id: number | string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories");
  return response.data;
};