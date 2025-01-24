import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandType } from '@seller-panel/types/brandType';
import { MetaType } from '@seller-panel/types/tableType';

const initialState: {
	brands: BrandType[];
	meta: MetaType | null;
} = {
	brands: [],
	meta: null,
};

const brandSlice = createSlice({
	name: 'brand',
	initialState,
	reducers: {
		setBrands: (state, action: PayloadAction<BrandType[]>) => {
			state.brands = action.payload;
		},
		setMeta: (state, action: PayloadAction<MetaType>) => {
			state.meta = action.payload;
		},
		setTableBrands: (
			state,
			action: PayloadAction<{
				brands: BrandType[];
				meta: MetaType | null;
			}>
		) => {
			state.brands = action.payload.brands;
			state.meta = action.payload.meta;
		},
		clearBrands: (state) => {
			state.brands = [];
			state.meta = null;
		},
	},
});
export const { setBrands, setMeta, setTableBrands, clearBrands } =
	brandSlice.actions;
export default brandSlice.reducer;
