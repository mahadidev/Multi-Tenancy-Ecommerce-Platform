import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageType, PageTypeType } from '@type/pageType';
import { MetaType } from '@type/tableType';

const initialState: {
	pages: PageType[];
    page: PageType | null;
    pageTypes: PageTypeType[];
	meta: MetaType | null;
} = {
	pages: [],
    page: null,
	meta: null,
    pageTypes: [],
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
		setPageTypes: (state, action: PayloadAction<PageTypeType[]>) => {
			state.pageTypes = action.payload;
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
export const { setPages, setMeta, setTablePages, clearPages, setPage, setPageTypes } =
	pageSlice.actions;
export default pageSlice.reducer;
