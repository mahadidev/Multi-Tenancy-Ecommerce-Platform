import { UserType } from "@/type/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    accessToken?: string | null;
    user?: UserType | null;
    tokenType?: string | null;
    stores: null | any;
    currentStore: any | null;
} = {
    accessToken: null,
    user: null,
    tokenType: null,
    stores: [],
    currentStore: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (
            state,
            action: PayloadAction<{
                access_token?: string | null;
                user?: UserType | null;
                token_type?: string | null;
                stores?: [] | null;
                currentStore?: any | null;
            }>
        ) => {
            state.accessToken = action.payload.access_token;
            state.user = action.payload.user;
            state.tokenType = action.payload.token_type;
            state.stores = action.payload.stores;
            state.currentStore =
                action.payload.currentStore ?? state.currentStore;
        },
        addStore: (state, action: PayloadAction<any>) => {
            state.stores = [...state.stores, action.payload];
        },
        setCurrentStore: (state, action: PayloadAction<any>) => {
            state.currentStore = action.payload;
        },
        removeAuth: (state) => {
            state.accessToken = null;
            state.user = null;
            state.tokenType = null;
            state.currentStore = null;
        },
    },
});
export const { setAuth, removeAuth, addStore, setCurrentStore } =
    authSlice.actions;
export default authSlice.reducer;
