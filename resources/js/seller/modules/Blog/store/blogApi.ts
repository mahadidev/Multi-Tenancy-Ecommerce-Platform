import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setBlogs } from "./blogSlice";
import type { 
  BlogsResponse, 
  BlogResponse, 
  CreateBlogPayload, 
  UpdateBlogPayload, 
  DeleteBlogPayload 
} from "../types";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Blogs"],
  endpoints: (builder) => ({
    fetchBlogs: builder.query<BlogsResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/blogs`,
          method: "get",
        }),
      providesTags: ["Blogs"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setBlogs({
              blogs: response.data.data.blogs,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    createBlog: builder.mutation<BlogResponse, CreateBlogPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/blogs`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Blogs"],
      transformErrorResponse: (error: any) => error.data,
    }),

    updateBlog: builder.mutation<BlogResponse, UpdateBlogPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/blogs/${formData.id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData,
        }),
      invalidatesTags: ["Blogs"],
      transformErrorResponse: (error: any) => error.data,
    }),

    deleteBlog: builder.mutation<BlogResponse, DeleteBlogPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/blogs/${formData.id}`,
          method: "delete",
          body: formData,
        }),
      invalidatesTags: ["Blogs"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;