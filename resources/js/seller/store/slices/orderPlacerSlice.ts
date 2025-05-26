import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    OrderPlacerCartItemType,
    OrderPlacerCustomerType,
} from '@type/orderPlacer';

const initialState: {
	cartItems: OrderPlacerCartItemType[];
	customer: OrderPlacerCustomerType | null;
	paymentMethod: 'Cash' | 'Bkash' | 'Nagad' | 'Card';
	status: 'Paid' | 'Pending' | 'Completed';
} = {
	cartItems: [],
	customer: null,
	paymentMethod: 'Cash',
	status: 'Paid',
};

const orderPlacerSlice = createSlice({
	name: 'orderPlacer',
	initialState,
	reducers: {
		setCustomer: (state, action: PayloadAction<OrderPlacerCustomerType>) => {
			state.customer = action.payload;
		},
		addCartItem: (state, action: PayloadAction<OrderPlacerCartItemType>) => {
            const findCartItem = state.cartItems.find((item) => item.product.sku === action.payload.product.sku);

			if (findCartItem) {
				state.cartItems = [
					...state.cartItems.filter(
						(item) => item.product.sku !== action.payload.product.sku
					),
					{
						...findCartItem,
						product: action.payload.product,
						qty: findCartItem.qty + action.payload.qty,
						price: findCartItem.price + action.payload.price,
						afterDiscountPrice:
							findCartItem.afterDiscountPrice +
							action.payload.afterDiscountPrice,
						taxAmount: findCartItem.taxAmount + action.payload.taxAmount,
						afterTaxPrice:
							findCartItem.afterTaxPrice + action.payload.afterTaxPrice,
					},
				];
			} else {
				state.cartItems = [...state.cartItems, action.payload];
			}
		},
		removeCartItem: (
			state,
			action: PayloadAction<{
				uniqueID: string;
			}>
		) => {
			state.cartItems = state.cartItems.filter(
				(item) => item.uniqueID !== action.payload.uniqueID
			);
		},
		setPaymentMethod: (
			state,
			action: PayloadAction<'Cash' | 'Bkash' | 'Nagad' | 'Card'>
		) => {
			state.paymentMethod = action.payload;
		},
		setStatus: (
			state,
			action: PayloadAction<'Paid' | 'Pending' | 'Completed'>
		) => {
			state.status = action.payload;
		},
		clearCart: (state) => {
			state.cartItems = [];
			state.customer = null;
			state.paymentMethod = 'Cash';
			state.status = 'Paid';
		},
	},
});
export const {
	setCustomer,
	addCartItem,
	removeCartItem,
	clearCart,
	setPaymentMethod,
	setStatus,
} = orderPlacerSlice.actions;
export default orderPlacerSlice.reducer;
