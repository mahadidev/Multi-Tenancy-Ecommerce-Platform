import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserProfile, AuthState } from '../types';

const initialState: AuthState = {
  user: null,
  userProfileData: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    removeUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.userProfileData = null;
      state.isAuthenticated = false;
    },
    setLoggedInUser: (
      state,
      action: PayloadAction<{
        loggedInUser: UserProfile;
      }>
    ) => {
      state.userProfileData = action.payload.loggedInUser;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setUser, 
  removeUser, 
  setAuth, 
  clearAuth, 
  setLoggedInUser,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;