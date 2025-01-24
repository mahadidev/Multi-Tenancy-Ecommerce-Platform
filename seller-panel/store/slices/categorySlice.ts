import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryType } from '@seller-panel/types/categoryType';
import { MetaType } from '@seller-panel/types/tableType';

const initialState: {
	categories: CategoryType[];
	meta: MetaType | null;
} = {
	categories: [],
	meta: null,
};

const categorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<CategoryType[]>) => {
			state.categories = action.payload;
		},
		setMeta: (state, action: PayloadAction<MetaType>) => {
			state.meta = action.payload;
		},
		setTableCategories: (
			state,
			action: PayloadAction<{
				categories: CategoryType[];
				meta: MetaType | null;
			}>
		) => {
			state.categories = action.payload.categories;
			state.meta = action.payload.meta;
		},
		clearCategories: (state) => {
			state.categories = [];
			state.meta = null;
		},
	},
});
export const { setCategories, setMeta, setTableCategories, clearCategories } =
	categorySlice.actions;
export default categorySlice.reducer;
