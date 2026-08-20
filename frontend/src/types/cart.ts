export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url: string | null;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
}

export interface AddToCartPayload {
  productId: number;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  itemId: number;
  quantity: number;
}
