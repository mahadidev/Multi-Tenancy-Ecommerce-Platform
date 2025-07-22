import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    OrderPlacerCartItemType,
    OrderPlacerCartItemVariantType,
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

export function areVariantsEqual(
	a: OrderPlacerCartItemVariantType[],
	b: OrderPlacerCartItemVariantType[]
): boolean {
	if (a.length !== b.length) return false;

	return a.every((itemA, index) => {
		const itemB = b[index];
		if (!itemB) return false;

		return (
			itemA.id === itemB.id &&
			itemA.label === itemB.label &&
			itemA.price === itemB.price
		);
	});
}

const orderPlacerSlice = createSlice({
	name: 'orderPlacer',
	initialState,
	reducers: {
		setCustomer: (state, action: PayloadAction<OrderPlacerCustomerType>) => {
			state.customer = action.payload;
		},
		addCartItem: (state, action: PayloadAction<OrderPlacerCartItemType>) => {
			const existingItemIndex = state.cartItems.findIndex(
				(item) => item.stock.id === action.payload.stock.id
			);
            const existingItem = state.cartItems[existingItemIndex];

			if (existingItemIndex !== -1 && existingItem) {
				state.cartItems[existingItemIndex] = {
					...existingItem,
					...action.payload,
					qty: existingItem.qty + action.payload.qty,
					price: existingItem.price + action.payload.price,
					discount_price:
						existingItem.discount_price + action.payload.discount_price,
					discount_amount:
						existingItem.discount_amount + action.payload.discount_amount,
					tax: existingItem.tax + action.payload.tax,
				};
			} else {
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
				(item) => item.stock.id === action.payload.stock.id
			);
			const existingItem = state.cartItems[existingItemIndex];

			// Existing item update
			if (existingItemIndex !== -1 && existingItem) {
				state.cartItems[existingItemIndex] = {
					...existingItem,
					...action.payload,
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
