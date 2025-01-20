import { MetaType } from "@/seller/types";
import { CategoryType } from "@/seller/types/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    categories: CategoryType[];
    categoriesMeta: MetaType | null | undefined;
} = {
    categories: [],
    categoriesMeta: null,
};
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<CategoryType[]>) => {
            state.categories = action.payload;
        },
        setCategoriesMeta: (
            state,
            action: PayloadAction<MetaType | undefined>
        ) => {
            state.categoriesMeta = action.payload;
        },
    },
});
export const { setCategories, setCategoriesMeta } = categorySlice.actions;
export default categorySlice.reducer;
