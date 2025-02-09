import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerType } from "@type/customersType";

const initialState: {
    customers: CustomerType[];
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
                customers: CustomerType[];
            }>
        ) => {
            state.customers = action.payload.customers;
        },
        clearCustomers: (state) => {
            state.customers = [];
        },
    },
});
export const { setCustomers, clearCustomers } = customerSlice.actions;
export default customerSlice.reducer;
