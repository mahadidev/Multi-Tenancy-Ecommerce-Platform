import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@type/authType";
import { DashboardAnalyticsType } from '../reducers/dashboardAnalyticsApi';
import { UserProfileType } from "./../../../types/authType.d";

const initialState: {
	user: UserType | null;
	userProfileData: UserProfileType | null;
	accessToken: string | null;
	analytics: DashboardAnalyticsType | null;
} = {
	user: null,
	userProfileData: null,
	accessToken: null,
	analytics: null,
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
        setLoggedInUser: (
            state,
            action: PayloadAction<{
                loggedInUser: UserProfileType;
            }>
        ) => {
            state.userProfileData = action.payload.loggedInUser;
        },
    },
});
export const { setUser, removeUser, setAuth, clearAuth, setLoggedInUser } =
    authSlice.actions;
export default authSlice.reducer;
