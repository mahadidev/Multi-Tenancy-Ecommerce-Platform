import { UserType } from "@/type/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    accessToken?: string | null;
    user?: UserType | null;
    tokenType?: string | null;
} = {
    accessToken: null,
    user: null,
    tokenType: null,
};
export const authSlice: any = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (
            state,
            action: PayloadAction<{
                access_token?: string | null;
                user?: UserType | null;
                token_type?: string | null;
            }>
        ) => {
            state.accessToken = action.payload.access_token;
            state.user = action.payload.user;
            state.tokenType = action.payload.token_type;
        },
        removeAuth: (state) => {
            state.accessToken = null;
            state.user = null;
            state.tokenType = null;
        },
    },
});
export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;
