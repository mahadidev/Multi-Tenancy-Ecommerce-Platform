import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogType } from '@type/blogType';

import { MetaType } from '@type/tableType';

const initialState: {
	blogs: BlogType[];
	blog: BlogType | null;
	meta: MetaType | null;
} = {
	blogs: [],
	blog: null,
	meta: null,
};

const blogSlice = createSlice({
	name: 'blog',
	initialState,
	reducers: {
		setBlogs: (state, action: PayloadAction<BlogType[]>) => {
			state.blogs = action.payload;
		},
		setMeta: (state, action: PayloadAction<MetaType>) => {
			state.meta = action.payload;
		},
		setTableBlogs: (
			state,
			action: PayloadAction<{
				blogs: BlogType[];
				meta: MetaType | null;
			}>
		) => {
			state.blogs = action.payload.blogs;
			state.meta = action.payload.meta;
		},
		setBlog: (state, action: PayloadAction<BlogType>) => {
			state.blog = action.payload;
			console.log(state.blog);
			
		},
		clearBlogs: (state) => {
			state.blogs = [];
			state.meta = null;
            state.blog = null
		},
	},
});
export const { setBlogs, setMeta, setTableBlogs, setBlog,clearBlogs } =
	blogSlice.actions;
export default blogSlice.reducer;
