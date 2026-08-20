export interface Order {
  id: number;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed";
  payment_method: string;
  delivery_option: string;
  shipping_address: string;
  coupon_code: string | null;
  discount_amount: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image_url: string | null;
}

export interface OrderDetailsResponse {
  order: Order;
  items: OrderItem[];
}

export interface OrdersListResponse {
  orders: Order[];
}

export interface CreateOrderPayload {
  shippingAddress: string;
  paymentMethod?: string;
  deliveryOption?: string;
  couponCode?: string | null;
  discountAmount?: number;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}
