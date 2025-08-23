import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { StockReportItem, StockReportSummary } from '../types';

export interface StockReportState {
  items: StockReportItem[];
  summary: StockReportSummary | null;
  filters: any;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const initialState: StockReportState = {
  items: [],
  summary: null,
  filters: {},
  meta: undefined,
};

const stockReportSlice = createSlice({
  name: 'stockReport',
  initialState,
  reducers: {
    setStockReport: (
      state,
      action: PayloadAction<{
        items: StockReportItem[];
        summary: StockReportSummary;
        meta?: StockReportState['meta'];
      }>
    ) => {
      state.items = action.payload.items;
      state.summary = action.payload.summary;
      state.meta = action.payload.meta;
    },
    
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = action.payload;
    },
    
    clearStockReport: (state) => {
      state.items = [];
      state.summary = null;
      state.filters = {};
      state.meta = undefined;
    },
  },
});

export const { 
  setStockReport,
  setFilters,
  clearStockReport
} = stockReportSlice.actions;

export default stockReportSlice.reducer;