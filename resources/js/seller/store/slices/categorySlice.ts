import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "@type/categoryType";
import { MetaType } from "@type/tableType";

const initialState: {
    categories: CategoryType[];
    productCategories: CategoryType[];
    blogCategories: CategoryType[];
    categoriesMeta: MetaType | null;
    productCategoriesMeta: MetaType | null;
    blogCategoriesMeta: MetaType | null;
} = {
    categories: [],
    productCategories: [],
    blogCategories: [],
    categoriesMeta: null,
    productCategoriesMeta: null,
    blogCategoriesMeta: null,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<CategoryType[]>) => {
            state.categories = action.payload;
        },

        setMeta: (state, action: PayloadAction<MetaType>) => {
            state.categoriesMeta = action.payload;
        },

        // product categories
        setTableProductCategories: (
            state,
            action: PayloadAction<{
                categories: CategoryType[];
                meta: MetaType | null;
            }>
        ) => {
            state.productCategories = action.payload.categories;
            state.productCategoriesMeta = action.payload.meta;
        },

        // product categories
        setTableBlogCategories: (
            state,
            action: PayloadAction<{
                categories: CategoryType[];
                meta: MetaType | null;
            }>
        ) => {
            state.blogCategories = action.payload.categories;
            state.blogCategoriesMeta = action.payload.meta;
        },

        // make the category state empty
        clearCategories: (state) => {
            state.categories = [];
            state.categoriesMeta = null;
        },
    },
});
export const {
    setCategories,
    setMeta,
    setTableProductCategories,
    setTableBlogCategories,
    clearCategories,
} = categorySlice.actions;
export default categorySlice.reducer;
