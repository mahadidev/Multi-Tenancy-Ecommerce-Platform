import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductStockHistoryType } from '@type/productType';

const initialState: {
	// updated
	histories: ProductStockHistoryType[];
	history: ProductStockHistoryType | null;
	meta: {
		current_page: number;
		first_page_url: string;
		last_page: number;
		last_page_url: string;
		next_page_url: string | null;
		prev_page_url: string | null;
		total: number;
		per_page: number;
	} | null;
} = {
	histories: [],
	history: null,
	meta: null,
};

const productStockHistorySlice = createSlice({
	name: 'productStockHistory',
	initialState,
	reducers: {
		setHistories: (state, action: PayloadAction<{
			histories: ProductStockHistoryType[];
			meta: {
				current_page: number;
				first_page_url: string;
				last_page: number;
				last_page_url: string;
				next_page_url: string | null;
				prev_page_url: string | null;
				total: number;
				per_page: number;
			} | null;
		}>) => {
			// Limit state size to prevent Redux performance issues
			const maxHistories = 100; // Keep only latest 100 records in state
			const histories = action.payload.histories.slice(0, maxHistories);
			
			state.histories = histories;
			state.meta = action.payload.meta;
		},
		setHistory: (state, action: PayloadAction<ProductStockHistoryType[]>) => {
			state.histories = action.payload;
		},
		clearHistories: (state) => {
			state.histories = [];
			state.history = null;
			state.meta = null;
		},
	},
});

export const {
	setHistories,
    setHistory,
    clearHistories
} = productStockHistorySlice.actions;
export default productStockHistorySlice.reducer;
