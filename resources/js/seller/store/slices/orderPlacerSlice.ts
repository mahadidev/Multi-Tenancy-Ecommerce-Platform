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
			const existingItemIndex = state.cartItems.findIndex(
				(item) => item.product.sku === action.payload.product.sku
			);
			const productStock = action.payload.product.stock ?? 0;
			const existingItem = state.cartItems[existingItemIndex];

			// Existing item update
			if (existingItemIndex !== -1 && existingItem) {
				// ✅ TypeScript knows this is safe
				const newQty = existingItem.qty + action.payload.qty;

				if (newQty > productStock) {
					console.warn('Not enough stock available.');
					return;
				}

				state.cartItems[existingItemIndex] = {
					...existingItem,
					qty: newQty,
					uniqueID: existingItem.uniqueID,
					product: existingItem.product,
					variants: existingItem.variants,
					price: existingItem.price + action.payload.price,
					discount_price:
						existingItem.discount_price + action.payload.discount_price,
					tax: existingItem.tax + action.payload.tax,
				};
			} else {
				// New item
				if (action.payload.qty > productStock) {
					console.warn('Not enough stock available.');
					return;
				}
				state.cartItems.push(action.payload);
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
		updateCartItem: (state, action: PayloadAction<OrderPlacerCartItemType>) => {
			const existingItemIndex = state.cartItems.findIndex(
				(item) => item.product.sku === action.payload.product.sku
			);
			const existingItem = state.cartItems[existingItemIndex];

			// Existing item update
			if (existingItemIndex !== -1 && existingItem) {
				state.cartItems[existingItemIndex] = {
                    ...existingItem,
					...action.payload
				};
			}
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
	updateCartItem,
} = orderPlacerSlice.actions;
export default orderPlacerSlice.reducer;
