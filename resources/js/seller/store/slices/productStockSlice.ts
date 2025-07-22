import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductStockHistoryType, ProductStockType } from '@type/productType';

const initialState: {
	productStocks: ProductStockType[];
	productStock: ProductStockType | null;
	productStockhistories: ProductStockHistoryType[];
} = {
	productStocks: [],
	productStock: null,
	productStockhistories: [],
};

const productStockSlice = createSlice({
	name: 'productStock',
	initialState,
	reducers: {
		setProductStocks: (state, action: PayloadAction<ProductStockType[]>) => {
			state.productStocks = action.payload;
		},
		setProductStock: (state, action: PayloadAction<ProductStockType>) => {
			state.productStock = action.payload;
		},
		setProductStockHistories: (
			state,
			action: PayloadAction<ProductStockHistoryType[]>
		) => {
			state.productStockhistories = action.payload;
		},
		clearProductStocks: (state) => {
			state.productStocks = [];
			state.productStock = null;
            state.productStockhistories = [];
		},
	},
});

export const {
	setProductStocks,
	setProductStock,
	setProductStockHistories,
	clearProductStocks,
} = productStockSlice.actions;
export default productStockSlice.reducer;
