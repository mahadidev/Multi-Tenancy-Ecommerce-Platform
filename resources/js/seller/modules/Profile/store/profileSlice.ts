import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileState, UserProfile } from "../types";

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  isUpdating: false,
  isUpdatingPassword: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<{ profile: UserProfile }>) => {
      state.profile = action.payload.profile;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },
    setUpdatingPassword: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingPassword = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.isUpdating = false;
      state.isUpdatingPassword = false;
    },
  },
});

export const {
  setProfile,
  setLoading,
  setError,
  setUpdating,
  setUpdatingPassword,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;