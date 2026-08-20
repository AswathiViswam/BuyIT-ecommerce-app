import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ViewMode = "grid" | "list";

export interface FilterState {
  category: string;
  brand: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  minDiscount: number;
}

interface SearchState {
  query: string;
  recentSearches: string[];
  viewMode: ViewMode;
  sort: string;
  page: number;
  filters: FilterState;
}

const savedRecent = localStorage.getItem("recentSearches");

const initialFilters: FilterState = {
  category: "",
  brand: [],
  minPrice: 0,
  maxPrice: 250000,
  minRating: 0,
  inStockOnly: false,
  minDiscount: 0,
};

const initialState: SearchState = {
  query: "",
  recentSearches: savedRecent ? JSON.parse(savedRecent) : ["Headphones", "MacBook", "Running Shoes", "Camera"],
  viewMode: "grid",
  sort: "newest",
  page: 1,
  filters: initialFilters,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const trimmed = action.payload.trim();
      if (!trimmed) return;
      state.recentSearches = [trimmed, ...state.recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      localStorage.setItem("recentSearches", JSON.stringify(state.recentSearches));
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem("recentSearches");
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
      state.page = 1;
    },
    toggleFilterBrand: (state, action: PayloadAction<string>) => {
      const b = action.payload;
      if (state.filters.brand.includes(b)) {
        state.filters.brand = state.filters.brand.filter((item) => item !== b);
      } else {
        state.filters.brand.push(b);
      }
      state.page = 1;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
      state.page = 1;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.filters.minRating = action.payload;
      state.page = 1;
    },
    toggleInStockOnly: (state) => {
      state.filters.inStockOnly = !state.filters.inStockOnly;
      state.page = 1;
    },
    setMinDiscount: (state, action: PayloadAction<number>) => {
      state.filters.minDiscount = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
      state.page = 1;
    },
  },
});

export const {
  setQuery,
  addRecentSearch,
  clearRecentSearches,
  setViewMode,
  setSort,
  setPage,
  setFilterCategory,
  toggleFilterBrand,
  setPriceRange,
  setMinRating,
  toggleInStockOnly,
  setMinDiscount,
  resetFilters,
} = searchSlice.actions;

export default searchSlice.reducer;
