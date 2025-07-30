import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductStockHistoryType } from '@type/productType';

const initialState: {
	// updated
	histories: ProductStockHistoryType[];
	history: ProductStockHistoryType | null;
} = {
	histories: [],
	history: null,
};

const productStockHistorySlice = createSlice({
	name: 'productStockHistory',
	initialState,
	reducers: {
		setHistories: (state, action: PayloadAction<ProductStockHistoryType[]>) => {
			state.histories = action.payload;
		},
		setHistory: (state, action: PayloadAction<ProductStockHistoryType[]>) => {
			state.histories = action.payload;
		},
		clearHistories: (state) => {
			state.histories = [];
			state.history = null;
		},
	},
});

export const {
	setHistories,
    setHistory,
    clearHistories
} = productStockHistorySlice.actions;
export default productStockHistorySlice.reducer;
