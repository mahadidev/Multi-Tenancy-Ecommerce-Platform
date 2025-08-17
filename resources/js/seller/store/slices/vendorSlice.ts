import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VendorType } from "@type/vendorType";
import { MetaType } from "@type/tableType";

const initialState: {
    vendors: VendorType[];
    meta: MetaType | null;
} = {
    vendors: [],
    meta: null,
};

const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {
        setVendors: (state, action: PayloadAction<VendorType[]>) => {
            state.vendors = action.payload;
        },
        setMeta: (state, action: PayloadAction<MetaType>) => {
            state.meta = action.payload;
        },
        setTableVendors: (
            state,
            action: PayloadAction<{
                vendors: VendorType[];
                meta: MetaType | null;
            }>
        ) => {
            state.vendors = action.payload.vendors;
            state.meta = action.payload.meta;
        },
        clearVendors: (state) => {
            state.vendors = [];
            state.meta = null;
        },
    },
});

export const { 
    setVendors, 
    setMeta, 
    setTableVendors, 
    clearVendors 
} = vendorSlice.actions;

export default vendorSlice.reducer;