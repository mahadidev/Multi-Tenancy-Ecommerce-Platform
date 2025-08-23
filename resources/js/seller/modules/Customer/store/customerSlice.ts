import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Customer } from "../types";

const initialState: {
  customers: Customer[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
} = {
  customers: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers: (
      state,
      action: PayloadAction<{
        customers: Customer[];
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
      state.customers = action.payload.customers;
      if (action.payload.meta) {
        state.meta = action.payload.meta;
      }
    },
    clearCustomers: (state) => {
      state.customers = [];
      state.meta = undefined;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.unshift(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    removeCustomer: (state, action: PayloadAction<number>) => {
      state.customers = state.customers.filter(c => c.id !== action.payload);
    },
  },
});

export const { 
  setCustomers, 
  clearCustomers, 
  addCustomer, 
  updateCustomer, 
  removeCustomer 
} = customerSlice.actions;

export default customerSlice.reducer;