import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    step: number;
    formData: {
        name?: string;
        domain?: string;
        logo?: string;
        primaryColor?: string;
        secondaryColor?: string;
        themeId?: string;
    } | null;
    store: any | null;
} = {
    step: 1,
    formData: {},
    store: {},
};
const storeOnboardSlice = createSlice({
    name: "storeOnboard",
    initialState,
    reducers: {
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        setFormData: (
            state,
            action: PayloadAction<{
                name: string;
                value: string;
            }>
        ) => {
            state.formData = {
                ...state.formData,
                [action.payload.name]: action.payload.value,
            };
        },
        setStore: (state, action: PayloadAction<any>) => {
            state.store = action.payload;
        },
        clearOnboard: (state) => {
            state.formData = null;
            state.store = null;
            state.step = 1;
        },
    },
});
export const { setStep, setFormData, setStore, clearOnboard } =
    storeOnboardSlice.actions;
export default storeOnboardSlice.reducer;
