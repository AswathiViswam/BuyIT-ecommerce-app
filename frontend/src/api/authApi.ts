import api from "./axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../types/auth";

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", credentials);
  return response.data;
};

export const logoutUser = async (refreshToken?: string | null) => {
  return await api.post("/auth/logout", { refreshToken });
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<{ message: string; resetToken?: string }> => {
  const response = await api.post<{ message: string; resetToken?: string }>("/auth/forgot-password", payload);
  return response.data;
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/reset-password", payload);
  return response.data;
};
