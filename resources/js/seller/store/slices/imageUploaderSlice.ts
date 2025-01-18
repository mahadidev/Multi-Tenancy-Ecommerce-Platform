import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    isModalOpen: boolean;
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
    },
});
export const { setModalOpen } = imageUploaderSlice.actions;
export default imageUploaderSlice.reducer;
