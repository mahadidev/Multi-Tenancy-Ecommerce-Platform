import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreType } from '@type/storeType';

const initialState: {
	store: StoreType | null;
    stores: StoreType[] | null
} = {
	store: null,
    stores: []
};

const storeSlice = createSlice({
	name: 'store',
	initialState,
	reducers: {
		setStore: (state, action: PayloadAction<StoreType>) => {
			state.store = action.payload;
		},
		setStores: (state, action: PayloadAction<StoreType[]>) => {
			state.stores = action.payload;
		},
		setAuthStore: (
			state,
			action: PayloadAction<{
				store: StoreType;
				stores: StoreType[];
			}>
		) => {
			state.store = action.payload.store;
			state.stores = action.payload.stores;
		},
		clearStore: (state) => {
			state.store = null;
			state.stores = [];
		},
	},
});
export const { setStore, setStores, setAuthStore, clearStore } = storeSlice.actions;
export default storeSlice.reducer;
