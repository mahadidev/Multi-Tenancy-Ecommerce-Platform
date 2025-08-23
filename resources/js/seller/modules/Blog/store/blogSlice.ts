import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Blog } from "../types";

const initialState: {
  blogs: Blog[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
} = {
  blogs: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (
      state,
      action: PayloadAction<{
        blogs: Blog[];
        meta?: {
          current_page: number;
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      }>
    ) => {
      state.blogs = action.payload.blogs;
      if (action.payload.meta) {
        state.meta = action.payload.meta;
      }
    },
    clearBlogs: (state) => {
      state.blogs = [];
      state.meta = undefined;
    },
  },
});

export const { setBlogs, clearBlogs } = blogSlice.actions;
export default blogSlice.reducer;