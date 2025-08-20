import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductStocksSummaryType } from '../reducers/productStocksApi';

const initialState: {
	summary: ProductStocksSummaryType | null;
} = {
	summary: null,
};

const productStocksSlice = createSlice({
	name: 'productStocks',
	initialState,
	reducers: {
		setProductStocksSummary: (state, action: PayloadAction<ProductStocksSummaryType>) => {
			state.summary = action.payload;
		},
		clearProductStocksSummary: (state) => {
			state.summary = null;
		},
	},
});

export const {
	setProductStocksSummary,
	clearProductStocksSummary,
} = productStocksSlice.actions;
export default productStocksSlice.reducer;