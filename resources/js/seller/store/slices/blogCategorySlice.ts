import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryType } from '@type/categoryType';
import { MetaType } from '@type/tableType';

const initialState: {
	categories: CategoryType[];
	meta: MetaType | null;
} = {
	categories: [],
	meta: null,
};

const blogCategorySlice = createSlice({
	name: 'blogCategory',
	initialState,
	reducers: {
		setBlogCategories: (state, action: PayloadAction<CategoryType[]>) => {
			state.categories = action.payload;
		},
		setBlogMeta: (state, action: PayloadAction<MetaType>) => {
			state.meta = action.payload;
		},
		setBlogTableCategories: (
			state,
			action: PayloadAction<{
				categories: CategoryType[];
				meta: MetaType | null;
			}>
		) => {
			state.categories = action.payload.categories;
			state.meta = action.payload.meta;
		},
		clearBlogCategories: (state) => {
			state.categories = [];
			state.meta = null;
		},
	},
});
export const { setBlogCategories, setBlogMeta, setBlogTableCategories, clearBlogCategories } =
	blogCategorySlice.actions;
export default blogCategorySlice.reducer;
