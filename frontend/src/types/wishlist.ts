import type { Product } from "./product";

export interface WishlistItem extends Product {
  wishlist_id: number;
  added_at: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  count: number;
}
