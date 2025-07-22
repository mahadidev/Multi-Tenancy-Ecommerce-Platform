import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderReportType, OrderType } from "@type/orderType";
import { ShipmentOrderType } from "@type/shipmentOrdersType";

const initialState: {
    orders: OrderType[];
    shipmentOrders: ShipmentOrderType[];
    order: OrderType | null;
    report: OrderReportType | null;
} = {
    orders: [],
    shipmentOrders: [],
    order: null,
    report: null
};

const orderSlice = createSlice({
	name: 'order',
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
		setOrderReport: (state, action: PayloadAction<OrderReportType>) => {
			state.report = action.payload;
		},
	},
});
export const { setOrders, setOrder, setShipmentOrders, clearOrdersStore, setOrderReport } =
    orderSlice.actions;
export default orderSlice.reducer;
