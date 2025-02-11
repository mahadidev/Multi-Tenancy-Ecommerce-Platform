import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreType, StoreTypesType } from "@type/storeType";

const initialState: {
    store: StoreType | null;
    currentStore: StoreType | null;
    stores: StoreType[] | null;
    storeTypes: StoreTypesType[];
} = {
    store: null,
    currentStore: null,
    stores: [],
    storeTypes: [],
};

const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers: {
        setStore: (state, action: PayloadAction<StoreType>) => {
            state.store = action.payload;
        },
        setStores: (state, action: PayloadAction<StoreType[]>) => {
            state.stores = action.payload;
        },
        setStoreTypes: (state, action: PayloadAction<StoreTypesType[]>) => {
            state.storeTypes = action.payload;
        },
        setAuthStore: (
            state,
            action: PayloadAction<{
                currentStore: StoreType;
                stores: StoreType[];
                store: StoreType;
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
        },
    },
});
export const { setStore, setStores, setStoreTypes, setAuthStore, clearStore } =
    storeSlice.actions;
export default storeSlice.reducer;
