import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page, PageType, PageState } from '../types';
import { MetaType } from '@type/tableType';

const initialState: PageState = {
  pages: [],
  page: null,
  pageTypes: [],
  meta: null,
  loading: false,
  error: null,
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload;
    },
    setMeta: (state, action: PayloadAction<MetaType>) => {
      state.meta = action.payload;
    },
    setPageTypes: (state, action: PayloadAction<PageType[]>) => {
      state.pageTypes = action.payload;
    },
    setTablePages: (
      state,
      action: PayloadAction<{
        pages: Page[];
        meta: MetaType | null;
      }>
    ) => {
      state.pages = action.payload.pages;
      state.meta = action.payload.meta;
    },
    setPage: (state, action: PayloadAction<Page>) => {
      state.page = action.payload;
    },
    clearPages: (state) => {
      state.pages = [];
      state.meta = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setPages, 
  setMeta, 
  setTablePages, 
  clearPages, 
  setPage, 
  setPageTypes,
  setLoading,
  setError,
} = pageSlice.actions;

export default pageSlice.reducer;