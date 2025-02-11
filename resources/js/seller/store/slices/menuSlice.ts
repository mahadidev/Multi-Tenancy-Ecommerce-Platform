import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuType } from "@type/menuType";

const initialState: {
    menus: MenuType[];
} = {
    menus: [],
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setMenus: (state, action: PayloadAction<MenuType[]>) => {
            state.menus = action.payload;
        },

        clearMenus: (state) => {
            state.menus = [];
        },
    },
});
export const { setMenus, clearMenus } = menuSlice.actions;
export default menuSlice.reducer;
