import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductStockHistoryType } from '@type/productType';

const initialState: {
	allProductStockHistory: ProductStockHistoryType[];
	productStockHistory: ProductStockHistoryType[];
} = {
	allProductStockHistory: [],
    productStockHistory: []
};

const productStockHistorySlice = createSlice({
	name: 'productStockHistory',
	initialState,
	reducers: {
		setAllProductStockHistory: (state, action: PayloadAction<ProductStockHistoryType[]>) => {
			state.allProductStockHistory = action.payload;
		},
		setProductStockHistory: (state, action: PayloadAction<ProductStockHistoryType[]>) => {
			state.productStockHistory = action.payload;
		},
		clearProductStockHistory: (state) => {
			state.allProductStockHistory = [];
			state.productStockHistory = [];
		},
	},
});

export const {
	setAllProductStockHistory,
    setProductStockHistory,
    clearProductStockHistory
} = productStockHistorySlice.actions;
export default productStockHistorySlice.reducer;
