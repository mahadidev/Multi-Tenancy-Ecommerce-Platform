import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderType } from "@type/orderType";
import { ShipmentOrderType } from "@type/shipmentOrdersType";

const initialState: {
    orders: OrderType[];
    shipmentOrders: ShipmentOrderType[];
    order: OrderType | null;
} = {
    orders: [],
    shipmentOrders: [],
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
        setShipmentOrders: (
            state,
            action: PayloadAction<{
                shipmentOrders: ShipmentOrderType[];
            }>
        ) => {
            state.shipmentOrders = action.payload.shipmentOrders;
        },
        clearOrdersStore: (state) => {
            state.order = null;
            state.orders = [];
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
export const { setOrders, setOrder, setShipmentOrders, clearOrdersStore } =
    orderSlice.actions;
export default orderSlice.reducer;
