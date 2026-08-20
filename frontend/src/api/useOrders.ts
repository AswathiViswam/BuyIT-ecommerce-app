import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderById, createOrder } from "./orderApi";
import { useAuth } from "../context/AuthContext";
import type { CreateOrderPayload } from "../types/order";

export const useOrders = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: isAuthenticated,
  });

  const createOrderMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    orders: ordersQuery.data?.orders || [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
    refetchOrders: ordersQuery.refetch,
  };
};

export const useOrderDetails = (orderId: number | string | undefined) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: isAuthenticated && !!orderId,
  });
};
