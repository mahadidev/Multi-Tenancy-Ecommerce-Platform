import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProductStock, ProductStockHistory, ProductStockSummary } from '../types';

export interface ProductStockState {
  stocks: ProductStock[];
  selectedStock: ProductStock | null;
  histories: ProductStockHistory[];
  selectedHistory: ProductStockHistory | null;
  summary: ProductStockSummary | null;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  historyMeta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const initialState: ProductStockState = {
  stocks: [],
  selectedStock: null,
  histories: [],
  selectedHistory: null,
  summary: null,
  meta: undefined,
  historyMeta: undefined,
};

const productStockSlice = createSlice({
  name: 'productStock',
  initialState,
  reducers: {
    setProductStocks: (
      state,
      action: PayloadAction<{
        stocks: ProductStock[];
        meta?: ProductStockState['meta'];
      }>
    ) => {
      state.stocks = action.payload.stocks;
      state.meta = action.payload.meta;
    },
    
    setSelectedStock: (state, action: PayloadAction<ProductStock | null>) => {
      state.selectedStock = action.payload;
    },
    
    addStock: (state, action: PayloadAction<ProductStock>) => {
      state.stocks.unshift(action.payload);
    },
    
    updateStock: (state, action: PayloadAction<ProductStock>) => {
      const index = state.stocks.findIndex(stock => stock.id === action.payload.id);
      if (index !== -1) {
        state.stocks[index] = action.payload;
      }
      if (state.selectedStock?.id === action.payload.id) {
        state.selectedStock = action.payload;
      }
    },
    
    removeStock: (state, action: PayloadAction<number>) => {
      state.stocks = state.stocks.filter(stock => stock.id !== action.payload);
      if (state.selectedStock?.id === action.payload) {
        state.selectedStock = null;
      }
    },

    setStockHistory: (
      state,
      action: PayloadAction<{
        histories: ProductStockHistory[];
        meta?: ProductStockState['historyMeta'];
      }>
    ) => {
      state.histories = action.payload.histories;
      state.historyMeta = action.payload.meta;
    },
    
    setSelectedHistory: (state, action: PayloadAction<ProductStockHistory | null>) => {
      state.selectedHistory = action.payload;
    },

    setStockSummary: (state, action: PayloadAction<ProductStockSummary>) => {
      state.summary = action.payload;
    },
    
    clearProductStock: (state) => {
      state.stocks = [];
      state.selectedStock = null;
      state.histories = [];
      state.selectedHistory = null;
      state.summary = null;
      state.meta = undefined;
      state.historyMeta = undefined;
    },
  },
});

export const { 
  setProductStocks,
  setSelectedStock,
  addStock,
  updateStock,
  removeStock,
  setStockHistory,
  setSelectedHistory,
  setStockSummary,
  clearProductStock
} = productStockSlice.actions;

export default productStockSlice.reducer;