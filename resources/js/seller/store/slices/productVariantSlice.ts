import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductVariantType } from '@type/productType';

const initialState: {
	productVariants: ProductVariantType[];
	productVariant: ProductVariantType | null;
} = {
	productVariants: [],
	productVariant: null,
};

const productVariantSlice = createSlice({
	name: 'productVariant',
	initialState,
	reducers: {
		setProductVariants: (
			state,
			action: PayloadAction<ProductVariantType[]>
		) => {
			state.productVariants = action.payload;
		},
		setProductVariant: (state, action: PayloadAction<ProductVariantType>) => {
			state.productVariant = action.payload;
		},
		clearProductVariants: (state) => {
			state.productVariants = [];
			state.productVariant = null;
		},
	},
});
export const { setProductVariants, setProductVariant, clearProductVariants } =
	productVariantSlice.actions;
export default productVariantSlice.reducer;
