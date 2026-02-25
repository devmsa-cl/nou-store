import { create } from "zustand";

interface ProductState {
  values: {
    search: string;
    category: string;
    priceRange: number;
    pageNumber: number;
    limit: number;
  };
  onSetPageNumber: (value: number) => void;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onPriceRange: (value: number) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  values: {
    search: "",
    category: "all",
    priceRange: 500,
    pageNumber: 1,
    limit: 5,
  },
  onSetPageNumber: (value) =>
    set((state) => ({ values: { ...state.values, pageNumber: value } })),
  onSearch: (value) =>
    set((state) => ({
      values: { ...state.values, search: value, pageNumber: 1 },
    })),
  onCategory: (value) =>
    set((state) => ({
      values: { ...state.values, category: value, pageNumber: 1 },
    })),
  onPriceRange: (value) =>
    set((state) => ({
      values: { ...state.values, priceRange: value, pageNumber: 1 },
    })),
}));
