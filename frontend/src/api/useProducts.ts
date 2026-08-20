import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById, getCategories } from "./productApi";
import type { ProductFilterParams } from "../types/product";

export const useProducts = (params?: ProductFilterParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};

export const useProduct = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });
};