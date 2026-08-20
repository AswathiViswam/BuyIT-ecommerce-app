import api from "./axios";
import type {
  OrdersListResponse,
  OrderDetailsResponse,
  CreateOrderPayload,
  CreateOrderResponse,
} from "../types/order";

export const getOrders = async (): Promise<OrdersListResponse> => {
  const response = await api.get<OrdersListResponse>("/orders");
  return response.data;
};

export const getOrderById = async (id: number | string): Promise<OrderDetailsResponse> => {
  const response = await api.get<OrderDetailsResponse>(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  const response = await api.post<CreateOrderResponse>("/orders", payload);
  return response.data;
};
