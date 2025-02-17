import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreAdminType } from "@type/storeAdminType";

const initialState: {
    admins: StoreAdminType[];
} = {
    admins: [],
};

const adminSlice = createSlice({
    name: "storeAdmin",
    initialState,
    reducers: {
        setAdmins: (
            state,
            action: PayloadAction<{
                admins: StoreAdminType[];
            }>
        ) => {
            state.admins = action.payload.admins;
        },
        clearAdmins: (state) => {
            state.admins = [];
        },
    },
});
export const { setAdmins, clearAdmins } = adminSlice.actions;
export default adminSlice.reducer;
