import type { Review } from "./review";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount_percent: number;
  stock: number;
  brand: string;
  rating: number;
  review_count: number;
  category_id: number;
  category_name?: string;
  image_url: string | null;
  specifications: string | Record<string, string> | null;
  created_at: string;
  reviews?: Review[];
  similarProducts?: Product[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  brands: string[];
}

export interface ProductFilterParams {
  search?: string;
  category_id?: number | string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  discount?: number;
  sort?: string;
  page?: number;
  limit?: number;
}