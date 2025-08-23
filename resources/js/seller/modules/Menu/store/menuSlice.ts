import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Menu } from "../types";

const initialState: {
  menus: Menu[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
} = {
  menus: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (
      state,
      action: PayloadAction<{
        menus: Menu[];
        meta?: {
          current_page: number;
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      }>
    ) => {
      state.menus = action.payload.menus;
      if (action.payload.meta) {
        state.meta = action.payload.meta;
      }
    },
    clearMenus: (state) => {
      state.menus = [];
      state.meta = undefined;
    },
  },
});

export const { setMenus, clearMenus } = menuSlice.actions;
export default menuSlice.reducer;