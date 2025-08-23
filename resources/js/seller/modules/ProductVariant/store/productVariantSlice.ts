import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProductVariant } from '../types';

export interface ProductVariantState {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const initialState: ProductVariantState = {
  variants: [],
  selectedVariant: null,
  meta: undefined,
};

const productVariantSlice = createSlice({
  name: 'productVariant',
  initialState,
  reducers: {
    setProductVariants: (
      state,
      action: PayloadAction<{
        variants: ProductVariant[];
        meta?: ProductVariantState['meta'];
      }>
    ) => {
      state.variants = action.payload.variants;
      state.meta = action.payload.meta;
    },
    
    setSelectedVariant: (state, action: PayloadAction<ProductVariant | null>) => {
      state.selectedVariant = action.payload;
    },
    
    addVariant: (state, action: PayloadAction<ProductVariant>) => {
      state.variants.unshift(action.payload);
    },
    
    updateVariant: (state, action: PayloadAction<ProductVariant>) => {
      const index = state.variants.findIndex(variant => variant.id === action.payload.id);
      if (index !== -1) {
        state.variants[index] = action.payload;
      }
      if (state.selectedVariant?.id === action.payload.id) {
        state.selectedVariant = action.payload;
      }
    },
    
    removeVariant: (state, action: PayloadAction<number>) => {
      state.variants = state.variants.filter(variant => variant.id !== action.payload);
      if (state.selectedVariant?.id === action.payload) {
        state.selectedVariant = null;
      }
    },
    
    clearProductVariants: (state) => {
      state.variants = [];
      state.selectedVariant = null;
      state.meta = undefined;
    },
  },
});

export const { 
  setProductVariants,
  setSelectedVariant,
  addVariant,
  updateVariant,
  removeVariant,
  clearProductVariants
} = productVariantSlice.actions;

export default productVariantSlice.reducer;