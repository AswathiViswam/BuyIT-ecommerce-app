import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: number[];
  count: number;
}

const initialState: WishlistState = {
  productIds: [],
  count: 0,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistIds: (state, action: PayloadAction<number[]>) => {
      state.productIds = action.payload;
      state.count = action.payload.length;
    },
    toggleWishlistId: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.productIds.includes(id)) {
        state.productIds = state.productIds.filter((item) => item !== id);
      } else {
        state.productIds.push(id);
      }
      state.count = state.productIds.length;
    },
    clearWishlist: (state) => {
      state.productIds = [];
      state.count = 0;
    },
  },
});

export const { setWishlistIds, toggleWishlistId, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
