import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeType } from '@type/themeType';

const initialState: {
	themes: ThemeType[];
	theme: ThemeType | null;
} = {
	themes: [],
	theme: null,
};

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setThemes: (state, action: PayloadAction<ThemeType[]>) => {
			state.themes = action.payload;
		},
		setTheme: (state, action: PayloadAction<ThemeType | null>) => {
			state.theme = action.payload;
		},
		clearTheme: (state) => {
			state.themes = [];
			state.theme = null;
		},
	},
});
export const { setThemes, setTheme, clearTheme } = themeSlice.actions;
export default themeSlice.reducer;
