import { FileType } from '@/seller/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
	files: FileType[]
} = {
	files: [],
};

const fileSlice = createSlice({
	name: 'file',
	initialState,
	reducers: {
		setFiles: (
			state,
			action: PayloadAction<FileType[]>
		) => {
			state.files = action.payload;
		},
        clearFiles: (state) => {
            state.files = []
        }
	},
});
export const { setFiles, clearFiles } = fileSlice.actions;
export default fileSlice.reducer;
