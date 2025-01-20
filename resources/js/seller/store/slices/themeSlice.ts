import { ThemeType } from "@/seller/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    themes: ThemeType[];
    theme: ThemeType | null;
} = {
    themes: [],
    theme: null,
};
const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setThemes: (state, action: PayloadAction<ThemeType[]>) => {
            state.themes = action.payload;
        },
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.theme = action.payload;
        },
    },
});
export const { setThemes, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
