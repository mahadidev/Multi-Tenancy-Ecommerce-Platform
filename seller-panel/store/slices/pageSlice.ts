import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageType } from '@seller-panel/types/pageType';
import { MetaType } from '@seller-panel/types/tableType';

const initialState: {
	pages: PageType[];
    page: PageType | null;
	meta: MetaType | null;
} = {
	pages: [],
    page: null,
	meta: null,
};

const pageSlice = createSlice({
	name: 'page',
	initialState,
	reducers: {
		setPages: (state, action: PayloadAction<PageType[]>) => {
			state.pages = action.payload;
		},
		setMeta: (state, action: PayloadAction<MetaType>) => {
			state.meta = action.payload;
		},
		setTablePages: (
			state,
			action: PayloadAction<{
				pages: PageType[];
				meta: MetaType | null;
			}>
		) => {
			state.pages = action.payload.pages;
			state.meta = action.payload.meta;
		},
		setPage: (state, action: PayloadAction<PageType>) => {
			state.page = action.payload;
		},
		clearPages: (state) => {
			state.pages = [];
			state.meta = null;
		},
	},
});
export const { setPages, setMeta, setTablePages, clearPages, setPage } =
	pageSlice.actions;
export default pageSlice.reducer;
