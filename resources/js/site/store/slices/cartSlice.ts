import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItemType } from '@type/cartType';


const initialState: {
	cartItems: CartItemType[] | null;
	totalCartQty: number;
	totalCartPrice: number;
} = {
	cartItems: null,
	totalCartQty: 0,
	totalCartPrice: 0,
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCart: (
			state,
			action: PayloadAction<{
				cartItems: CartItemType[];
				totalCartQty: number;
				totalCartPrice: number;
			}>
		) => {
			state.cartItems = action.payload.cartItems;
			state.totalCartQty = action.payload.totalCartQty;
			state.totalCartPrice = action.payload.totalCartPrice;
		},
		setCartItems: (state, action: PayloadAction<CartItemType[]>) => {
			state.cartItems = action.payload;
		},
		clearCart: (state) => {
			state.cartItems = null;
		},
	},
});
export const { setCart, setCartItems, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
