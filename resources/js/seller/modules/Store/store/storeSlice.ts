import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Store, StoreType, StoreAdmin, StoreState } from '../types';

const initialState: StoreState = {
  store: null,
  currentStore: null,
  stores: [],
  storeTypes: [],
  admins: [],
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStore: (state, action: PayloadAction<Store>) => {
      state.store = action.payload;
    },
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
    setStoreTypes: (state, action: PayloadAction<StoreType[]>) => {
      state.storeTypes = action.payload;
    },
    setAdmins: (state, action: PayloadAction<{ admins: StoreAdmin[] }>) => {
      state.admins = action.payload.admins;
    },
    setAuthStore: (
      state,
      action: PayloadAction<{
        currentStore: Store;
        stores: Store[];
        store: Store;
      }>
    ) => {
      state.currentStore = action.payload.currentStore;
      state.store = action.payload.store;
      state.stores = action.payload.stores;
    },
    clearStore: (state) => {
      state.store = null;
      state.stores = [];
      state.storeTypes = [];
      state.admins = [];
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
  setStore, 
  setStores, 
  setStoreTypes, 
  setAdmins,
  setAuthStore, 
  clearStore,
  setLoading,
  setError,
} = storeSlice.actions;

export default storeSlice.reducer;