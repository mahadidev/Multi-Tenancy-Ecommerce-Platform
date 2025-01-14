import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    sidebar: {
        desktop: {
            isCollapsed: boolean;
        };
        mobile: {
            isOpenMobile: boolean;
        };
        width: number;
    };
    inSidebar: {
        desktop: {
            isCollapsed: boolean;
        };
        mobile: {
            isOpenMobile: boolean;
        };
        width: number;
    };
} = {
    sidebar: {
        desktop: {
            isCollapsed: false,
        },
        mobile: {
            isOpenMobile: false,
        },
        width: 0,
    },
    inSidebar: {
        desktop: {
            isCollapsed: false,
        },
        mobile: {
            isOpenMobile: false,
        },
        width: 0,
    },
};
const baseSlice = createSlice({
    name: "base",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebar.desktop.isCollapsed =
                !state.sidebar.desktop.isCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebar.desktop.isCollapsed = action.payload;
            state.sidebar.mobile.isOpenMobile = !action.payload;
        },
        toggleIsOpenMobile: (state) => {
            state.sidebar.mobile.isOpenMobile =
                !state.sidebar.mobile.isOpenMobile;
        },
        setIsOpenMobile: (state, action: PayloadAction<boolean>) => {
            state.sidebar.mobile.isOpenMobile = action.payload;
        },
        setSidebarWidth: (state, action: PayloadAction<number>) => {
            state.sidebar.width = action.payload;
        },
        toggleInSidebar: (state) => {
            state.inSidebar.desktop.isCollapsed =
                !state.inSidebar.desktop.isCollapsed;
        },
        setInSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.inSidebar.desktop.isCollapsed = action.payload;
            state.inSidebar.mobile.isOpenMobile = !action.payload;
        },
        toggleInsideIsOpenMobile: (state) => {
            state.inSidebar.mobile.isOpenMobile =
                !state.inSidebar.mobile.isOpenMobile;
        },
        setInsideIsOpenMobile: (state, action: PayloadAction<boolean>) => {
            state.inSidebar.mobile.isOpenMobile = action.payload;
        },
        setInSidebarWidth: (state, action: PayloadAction<number>) => {
            state.inSidebar.width = action.payload;
        },
    },
});
export const {
    toggleSidebar,
    setSidebarCollapsed,
    toggleIsOpenMobile,
    setIsOpenMobile,
    setSidebarWidth,
    toggleInSidebar,
    setInSidebarCollapsed,
    toggleInsideIsOpenMobile,
    setInsideIsOpenMobile,
    setInSidebarWidth,
} = baseSlice.actions;
export default baseSlice.reducer;
