import { dummyCategories } from '@/themes/dummyData/dummyCategories';
import { CategoryType } from '@/types/categoryType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
	categories: CategoryType[] | null;
} = {
	categories: dummyCategories,
};

const storeSlice = createSlice({
	name: 'store',
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<CategoryType[]>) => {
			state.categories = action.payload;
		},
		clearCategories: (state) => {
			state.categories = null;
		},
	},
});
export const { setCategories, clearCategories } = storeSlice.actions;
export default storeSlice.reducer;
