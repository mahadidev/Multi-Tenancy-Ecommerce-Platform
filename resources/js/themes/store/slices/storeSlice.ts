import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dummyStore } from '@themes/dummyData/dummyStore';
import { StoreType } from '@type/storeType';


const initialState: {
	store: StoreType | null;
} = {
	store: dummyStore,
};

const storeSlice = createSlice({
	name: 'store',
	initialState,
	reducers: {
		setStore: (state, action: PayloadAction<StoreType>) => {
			state.store = action.payload;
		},
		clearStore: (state) => {
			state.store = null;
		},
	},
});
export const { setStore, clearStore } = storeSlice.actions;
export default storeSlice.reducer;
