import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ToastState {
  id?: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  visible: boolean;
}

interface UiState {
  toast: ToastState | null;
  quickViewProductId: number | null;
  searchOverlayOpen: boolean;
}

const initialState: UiState = {
  toast: null,
  quickViewProductId: null,
  searchOverlayOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; type?: "success" | "error" | "info" | "warning" }>
    ) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || "success",
        visible: true,
      };
    },
    hideToast: (state) => {
      if (state.toast) {
        state.toast.visible = false;
      }
    },
    setQuickViewProductId: (state, action: PayloadAction<number | null>) => {
      state.quickViewProductId = action.payload;
    },
    setSearchOverlayOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOverlayOpen = action.payload;
    },
  },
});

export const { showToast, hideToast, setQuickViewProductId, setSearchOverlayOpen } = uiSlice.actions;
export default uiSlice.reducer;
