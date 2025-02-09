import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemType } from "@type/cartType";

const initialState: {
    cartItems: CartItemType[];
} = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartItems: (state, action: PayloadAction<CartItemType[]>) => {
            state.cartItems = action.payload;
        },

        clearCartItems: (state) => {
            state.cartItems = [];
        },
    },
});
export const { setCartItems, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;
