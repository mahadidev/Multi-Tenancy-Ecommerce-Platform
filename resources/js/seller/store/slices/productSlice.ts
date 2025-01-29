import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '@type/productType';
import { MetaType } from '@type/tableType';

const initialState: {
	products: ProductType[];
	product: ProductType | null;
	meta: MetaType | null;
} = {
	products: [],
	product: null,
	meta: null,
};

const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {
		setProducts: (state, action: PayloadAction<ProductType[]>) => {
			state.products = action.payload;
		},
		setMeta: (state, action: PayloadAction<MetaType>) => {
			state.meta = action.payload;
		},
		setTableProducts: (
			state,
			action: PayloadAction<{
				products: ProductType[];
				meta: MetaType | null;
			}>
		) => {
			state.products = action.payload.products;
			state.meta = action.payload.meta;
		},
		setProduct: (state, action: PayloadAction<ProductType>) => {
			state.product = action.payload;
			console.log(state.product);
		},
		clearProducts: (state) => {
			state.products = [];
			state.meta = null;
			state.product = null;
		},
	},
});
export const {
	setProducts,
	setMeta,
	setTableProducts,
	setProduct,
	clearProducts,
} = productSlice.actions;
export default productSlice.reducer;
