import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfileType, UserType } from "@type/authType";

const initialState: {
    user: UserType | null;
    accessToken: string | null;
    userProfileData: UserProfileType | null;
} = {
    user: null,
    accessToken: null,
    userProfileData: null,
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
        setUserProfile: (state, action: PayloadAction<UserProfileType>) => {
            state.userProfileData = action.payload;
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.userProfileData = null;
            state.user = null;
        },
    },
});
export const { setUser, removeUser, setAuth, clearAuth, setUserProfile } =
    authSlice.actions;
export default authSlice.reducer;
