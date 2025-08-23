import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnboardState, OnboardFormData } from "../types";

const initialState: OnboardState = {
  currentStep: 1,
  storeData: {},
  completedSteps: [],
  loading: false,
  error: null,
  isSubmitting: false,
};

const onboardSlice = createSlice({
  name: "onboard",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setStoreData: (state, action: PayloadAction<Partial<OnboardFormData>>) => {
      state.storeData = { ...state.storeData, ...action.payload };
    },
    addCompletedStep: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    removeCompletedStep: (state, action: PayloadAction<number>) => {
      state.completedSteps = state.completedSteps.filter(
        (step) => step !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      state.isSubmitting = false;
    },
    clearOnboardData: (state) => {
      state.currentStep = 1;
      state.storeData = {};
      state.completedSteps = [];
      state.loading = false;
      state.error = null;
      state.isSubmitting = false;
    },
    nextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
  },
});

export const {
  setCurrentStep,
  setStoreData,
  addCompletedStep,
  removeCompletedStep,
  setLoading,
  setSubmitting,
  setError,
  clearOnboardData,
  nextStep,
  previousStep,
} = onboardSlice.actions;

export default onboardSlice.reducer;