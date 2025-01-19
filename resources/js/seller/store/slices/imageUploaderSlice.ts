import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    isModalOpen: boolean;
    onSuccess?: CallableFunction;
} = {
    isModalOpen: true,
};
const imageUploaderSlice = createSlice({
    name: "imageUploader",
    initialState,
    reducers: {
        setModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload;
        },
        setOnSuccesss: (state, action: PayloadAction<CallableFunction>) => {
            state.onSuccess = action.payload;
        },
    },
});
export const { setModalOpen, setOnSuccesss } = imageUploaderSlice.actions;
export default imageUploaderSlice.reducer;
