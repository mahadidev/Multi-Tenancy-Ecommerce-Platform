import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    sidebar: {
        desktop: {
            isCollapsed: boolean;
        };
        mobile: {
            isOpenMobile: boolean;
        };
    };
} = {
    sidebar: {
        desktop: {
            isCollapsed: false,
        },
        mobile: {
            isOpenMobile: false,
        },
    },
};
export const baseSlice = createSlice({
    name: "base",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebar.desktop.isCollapsed =
                !state.sidebar.desktop.isCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebar.desktop.isCollapsed = action.payload;
        },
        toggleIsOpenMobile: (state) => {
            state.sidebar.mobile.isOpenMobile =
                !state.sidebar.mobile.isOpenMobile;
        },
        setIsOpenMobile: (state, action: PayloadAction<boolean>) => {
            state.sidebar.mobile.isOpenMobile = action.payload;
        },
    },
});
export const {
    toggleSidebar,
    setSidebarCollapsed,
    toggleIsOpenMobile,
    setIsOpenMobile,
} = baseSlice.actions;
export default baseSlice.reducer;
