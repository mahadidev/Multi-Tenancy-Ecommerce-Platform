import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@type/authType";

const initialState: {
    user: UserType | null;
    accessToken: string | null;
} = {
    user: null,
    accessToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        },
        setAuth: (
            state,
            action: PayloadAction<{
                user: UserType;
                accessToken: string;
            }>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.user = null;
        },
    },
});
export const { setUser, removeUser, setAuth, clearAuth,  } =
    authSlice.actions;
export default authSlice.reducer;
