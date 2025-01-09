import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    settings: null | any;
} = {
    settings: null,
};
const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<boolean>) => {
            state.settings = action.payload;
        },
    },
});
export const { setSettings } = settingSlice.actions;
export default settingSlice.reducer;
