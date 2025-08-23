import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Expense, Vendor } from "../types";

const initialState: {
  expenses: Expense[];
  vendors: Vendor[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
} = {
  expenses: [],
  vendors: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenses: (
      state,
      action: PayloadAction<{
        expenses: Expense[];
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
      state.expenses = action.payload.expenses;
      if (action.payload.meta) {
        state.meta = action.payload.meta;
      }
    },
    setVendors: (
      state,
      action: PayloadAction<{
        vendors: Vendor[];
      }>
    ) => {
      state.vendors = action.payload.vendors;
    },
    clearExpenses: (state) => {
      state.expenses = [];
      state.meta = undefined;
    },
    clearVendors: (state) => {
      state.vendors = [];
    },
  },
});

export const { setExpenses, setVendors, clearExpenses, clearVendors } = expenseSlice.actions;
export default expenseSlice.reducer;