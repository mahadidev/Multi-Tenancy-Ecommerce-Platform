import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
	heroSectionHeight: number;
} = {
	heroSectionHeight: 0,
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setHeroSectionHeight: (state, action: PayloadAction<number>) => {
			state.heroSectionHeight = action.payload;
		},
	},
});
export const { setHeroSectionHeight } = uiSlice.actions;
export default uiSlice.reducer;
