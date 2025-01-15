import { StoreType } from "@/seller/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    stores: StoreType[] | any;
    currentStore: StoreType | any | null;
} = {
    stores: [],
    currentStore: null,
};
const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers: {
        setStoreResponse: (
            state,
            action: PayloadAction<{
                stores: [];
                currentStore: any;
            }>
        ) => {
            state.stores = action.payload.stores;
            state.currentStore = action.payload.currentStore;
        },
        setStores: (state, action: PayloadAction<[]>) => {
            state.stores = action.payload;
        },
        addStore: (state, action: PayloadAction<any>) => {
            state.stores = [...state.stores, action.payload];
        },
        setCurrentStore: (state, action: PayloadAction<any>) => {
            state.currentStore = action.payload;
        },
        removeStore: (state) => {
            state.stores = null;
            state.currentStore = null;
        },
    },
});
export const {
    setStores,
    addStore,
    setCurrentStore,
    removeStore,
    setStoreResponse,
} = storeSlice.actions;
export default storeSlice.reducer;
