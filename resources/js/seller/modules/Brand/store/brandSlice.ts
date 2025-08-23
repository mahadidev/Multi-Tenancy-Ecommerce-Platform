import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Brand } from "../types";

const initialState: {
  brands: Brand[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
} = {
  brands: [],
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setBrands: (
      state,
      action: PayloadAction<{
        brands: Brand[];
        meta?: {
          current_page: number;
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      }>
    ) => {
      state.brands = action.payload.brands;
      if (action.payload.meta) {
        state.meta = action.payload.meta;
      }
    },
    clearBrands: (state) => {
      state.brands = [];
      state.meta = undefined;
    },
    addBrand: (state, action: PayloadAction<Brand>) => {
      state.brands.unshift(action.payload);
    },
    updateBrand: (state, action: PayloadAction<Brand>) => {
      const index = state.brands.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },
    removeBrand: (state, action: PayloadAction<number>) => {
      state.brands = state.brands.filter(b => b.id !== action.payload);
    },
  },
});

export const { 
  setBrands, 
  clearBrands, 
  addBrand, 
  updateBrand, 
  removeBrand 
} = brandSlice.actions;

export default brandSlice.reducer;