import { MetaType } from "@/seller/types";
import { BrandType } from "@/seller/types/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    brands: BrandType[];
    brandsMeta: MetaType | null | undefined;
} = {
    brands: [],
    brandsMeta: null,
};
const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        setBrands: (state, action: PayloadAction<BrandType[]>) => {
            state.brands = action.payload;
        },
        setBrandsMeta: (state, action: PayloadAction<MetaType | undefined>) => {
            state.brandsMeta = action.payload;
        },
    },
});
export const { setBrands, setBrandsMeta } = brandSlice.actions;
export default brandSlice.reducer;
