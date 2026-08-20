import api from "./axios";

export interface ValidateCouponResponse {
  message: string;
  coupon: {
    code: string;
    discountPercent: number;
    discountAmount: number;
    minOrderValue: number;
  };
}

export const validateCoupon = async (code: string, orderAmount: number): Promise<ValidateCouponResponse> => {
  const response = await api.post<ValidateCouponResponse>("/coupons/validate", {
    code,
    orderAmount,
  });
  return response.data;
};
