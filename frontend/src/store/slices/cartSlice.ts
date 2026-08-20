import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
  discountAmount: number;
  minOrderValue: number;
}

export type DeliveryOption = "standard" | "express";
export type PaymentMethod = "CARD" | "UPI" | "NET_BANKING" | "COD";

interface CartState {
  appliedCoupon: AppliedCoupon | null;
  deliveryOption: DeliveryOption;
  paymentMethod: PaymentMethod;
}

const initialState: CartState = {
  appliedCoupon: null,
  deliveryOption: "standard",
  paymentMethod: "COD",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    applyCoupon: (state, action: PayloadAction<AppliedCoupon>) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
    setDeliveryOption: (state, action: PayloadAction<DeliveryOption>) => {
      state.deliveryOption = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
    },
    clearCartState: (state) => {
      state.appliedCoupon = null;
      state.deliveryOption = "standard";
      state.paymentMethod = "COD";
    },
  },
});

export const {
  applyCoupon,
  removeCoupon,
  setDeliveryOption,
  setPaymentMethod,
  clearCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
