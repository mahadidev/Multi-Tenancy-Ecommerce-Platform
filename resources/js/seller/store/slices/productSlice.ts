import { MetaType } from "@/seller/types";
import { ProductType } from "@/seller/types/ecommerce";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    products: ProductType[];
    productsMeta: MetaType | null | undefined;
} = {
    products: [],
    productsMeta: null,
};
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<ProductType[]>) => {
            state.products = action.payload;
        },
        setProductsMeta: (
            state,
            action: PayloadAction<MetaType | undefined>
        ) => {
            state.productsMeta = action.payload;
        },
    },
});
export const { setProducts, setProductsMeta } = productSlice.actions;
export default productSlice.reducer;
