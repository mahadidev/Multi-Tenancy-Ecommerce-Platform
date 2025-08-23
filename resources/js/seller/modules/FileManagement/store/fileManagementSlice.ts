import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FileManagement } from '../types';

export interface FileManagementState {
  files: FileManagement[];
  selectedFile: FileManagement | null;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const initialState: FileManagementState = {
  files: [],
  selectedFile: null,
  meta: undefined,
};

const fileManagementSlice = createSlice({
  name: 'fileManagement',
  initialState,
  reducers: {
    setFiles: (
      state,
      action: PayloadAction<{
        files: FileManagement[];
        meta?: FileManagementState['meta'];
      }>
    ) => {
      state.files = action.payload.files;
      state.meta = action.payload.meta;
    },
    
    setSelectedFile: (state, action: PayloadAction<FileManagement | null>) => {
      state.selectedFile = action.payload;
    },
    
    addFile: (state, action: PayloadAction<FileManagement>) => {
      state.files.unshift(action.payload);
    },
    
    updateFile: (state, action: PayloadAction<FileManagement>) => {
      const index = state.files.findIndex(file => file.id === action.payload.id);
      if (index !== -1) {
        state.files[index] = action.payload;
      }
      if (state.selectedFile?.id === action.payload.id) {
        state.selectedFile = action.payload;
      }
    },
    
    removeFile: (state, action: PayloadAction<number>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
      if (state.selectedFile?.id === action.payload) {
        state.selectedFile = null;
      }
    },
    
    clearFiles: (state) => {
      state.files = [];
      state.selectedFile = null;
      state.meta = undefined;
    },
  },
});

export const { 
  setFiles, 
  setSelectedFile, 
  addFile, 
  updateFile, 
  removeFile, 
  clearFiles 
} = fileManagementSlice.actions;

export default fileManagementSlice.reducer;