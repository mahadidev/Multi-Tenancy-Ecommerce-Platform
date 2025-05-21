import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItemType } from '@type/cartType';


const initialState: {
	items: CartItemType[] | null;
	qty: number;
	price: number;
} = {
	items: null,
	qty: 0,
	price: 0,
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCart: (
			state,
			action: PayloadAction<{
				items: CartItemType[];
				qty: number;
				price: number;
			}>
		) => {
			state.items = action.payload.items;
			state.qty = action.payload.qty;
			state.price = action.payload.price;
		},
		setItems: (state, action: PayloadAction<CartItemType[]>) => {
			state.items = action.payload;
		},
		clearCart: (state) => {
			state.items = null;
		},
	},
});
export const { setCart, setItems, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
