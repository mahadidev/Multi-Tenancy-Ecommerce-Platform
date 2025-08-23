import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '../types';

export interface ThemeState {
  themes: Theme[];
  selectedTheme: Theme | null;
  activeTheme: Theme | null;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const initialState: ThemeState = {
  themes: [],
  selectedTheme: null,
  activeTheme: null,
  meta: undefined,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemes: (
      state,
      action: PayloadAction<{
        themes: Theme[];
        meta?: ThemeState['meta'];
      }>
    ) => {
      state.themes = action.payload.themes;
      state.meta = action.payload.meta;
      // Set active theme
      const activeTheme = action.payload.themes.find(theme => theme.is_active);
      if (activeTheme) {
        state.activeTheme = activeTheme;
      }
    },
    
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.selectedTheme = action.payload;
    },
    
    setActiveTheme: (state, action: PayloadAction<Theme>) => {
      // Update previous active theme
      if (state.activeTheme) {
        const prevActiveIndex = state.themes.findIndex(theme => theme.id === state.activeTheme!.id);
        if (prevActiveIndex !== -1) {
          state.themes[prevActiveIndex].is_active = false;
        }
      }
      
      // Set new active theme
      state.activeTheme = action.payload;
      const newActiveIndex = state.themes.findIndex(theme => theme.id === action.payload.id);
      if (newActiveIndex !== -1) {
        state.themes[newActiveIndex].is_active = true;
      }
    },
    
    addTheme: (state, action: PayloadAction<Theme>) => {
      state.themes.unshift(action.payload);
    },
    
    clearThemes: (state) => {
      state.themes = [];
      state.selectedTheme = null;
      state.activeTheme = null;
      state.meta = undefined;
    },
  },
});

export const { 
  setThemes,
  setTheme,
  setActiveTheme,
  addTheme,
  clearThemes
} = themeSlice.actions;

export default themeSlice.reducer;