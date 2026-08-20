import type { User } from "./auth";

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  is_default: number;
  created_at: string;
}

export interface ProfileResponse {
  user: User;
  addresses: Address[];
}

export interface CreateAddressPayload {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
}
