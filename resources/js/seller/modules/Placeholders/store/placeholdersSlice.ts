import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlaceholdersState, Placeholder, PlaceholderFilters } from "../types";

const initialState: PlaceholdersState = {
  placeholders: [],
  selectedPlaceholder: null,
  meta: null,
  filters: {
    page: 1,
    limit: 10,
  },
  loading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
};

const placeholdersSlice = createSlice({
  name: "placeholders",
  initialState,
  reducers: {
    setPlaceholders: (state, action: PayloadAction<{ placeholders: Placeholder[]; meta?: any }>) => {
      state.placeholders = action.payload.placeholders;
      state.meta = action.payload.meta;
      state.loading = false;
      state.error = null;
    },
    addPlaceholder: (state, action: PayloadAction<Placeholder>) => {
      state.placeholders.push(action.payload);
    },
    updatePlaceholder: (state, action: PayloadAction<Placeholder>) => {
      const index = state.placeholders.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.placeholders[index] = action.payload;
      }
      if (state.selectedPlaceholder?.id === action.payload.id) {
        state.selectedPlaceholder = action.payload;
      }
    },
    removePlaceholder: (state, action: PayloadAction<number | string>) => {
      state.placeholders = state.placeholders.filter(p => p.id !== action.payload);
      if (state.selectedPlaceholder?.id === action.payload) {
        state.selectedPlaceholder = null;
      }
    },
    setSelectedPlaceholder: (state, action: PayloadAction<Placeholder | null>) => {
      state.selectedPlaceholder = action.payload;
    },
    setFilters: (state, action: PayloadAction<PlaceholderFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },
    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
    },
    clearPlaceholders: (state) => {
      state.placeholders = [];
      state.selectedPlaceholder = null;
      state.meta = null;
      state.loading = false;
      state.error = null;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
    },
  },
});

export const {
  setPlaceholders,
  addPlaceholder,
  updatePlaceholder,
  removePlaceholder,
  setSelectedPlaceholder,
  setFilters,
  clearFilters,
  setLoading,
  setCreating,
  setUpdating,
  setDeleting,
  setError,
  clearPlaceholders,
} = placeholdersSlice.actions;

export default placeholdersSlice.reducer;