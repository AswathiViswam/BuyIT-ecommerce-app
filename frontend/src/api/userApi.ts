import api from "./axios";
import type { ProfileResponse, CreateAddressPayload, Address } from "../types/user";
import type { User } from "../types/auth";

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>("/user/profile");
  return response.data;
};

export const updateProfile = async (payload: { name?: string; phone?: string; avatar?: string }): Promise<{ message: string; user: User }> => {
  const response = await api.put<{ message: string; user: User }>("/user/profile", payload);
  return response.data;
};

export const changePassword = async (payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>("/user/change-password", payload);
  return response.data;
};

export const getAddresses = async (): Promise<{ addresses: Address[] }> => {
  const response = await api.get<{ addresses: Address[] }>("/user/addresses");
  return response.data;
};

export const addAddress = async (payload: CreateAddressPayload): Promise<{ message: string; address: Address }> => {
  const response = await api.post<{ message: string; address: Address }>("/user/addresses", payload);
  return response.data;
};

export const deleteAddress = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/user/addresses/${id}`);
  return response.data;
};
