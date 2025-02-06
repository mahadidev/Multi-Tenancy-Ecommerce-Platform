import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderType } from "@type/orderType";

const initialState: {
    orders: OrderType[] | null;
    order: OrderType | null;
} = {
    orders: null,
    order: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrder: (
            state,
            action: PayloadAction<{
                order: OrderType;
            }>
        ) => {
            state.order = action.payload.order;
        },
        clearOrdersStore: (state) => {
            state.order = null;
            state.orders = null;
        },
        setOrders: (
            state,
            action: PayloadAction<{
                orders: OrderType[];
            }>
        ) => {
            state.orders = action.payload.orders;
        },
    },
});
export const { setOrders, setOrder, clearOrdersStore } = orderSlice.actions;
export default orderSlice.reducer;
