import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { BlogType } from "@type/blogType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setBlog, setTableBlogs } from "../slices/blogSlice";

export interface BlogsFetchResponseType extends ApiResponseType {
    data: {
        blogs: BlogType[];
    };
}

export interface FetchBlogPayloadType {
    id: number | string;
}

export interface CreateBlogPayloadType {
    title: string;
    slug: string;
    content: string;
    category_id: number;
    image: string;
}

export interface UpdateBlogPayloadType {
    id: number;
    title?: string;
    slug?: string;
    status?: string;
    category_id?: number;
    content?: string;
    image?: string;
}

export interface DeleteBlogPayloadType {
    id: number | string;
}

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Blogs"],
    endpoints: (builder) => ({
        fetchBlogs: builder.query<BlogsFetchResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/blog`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Blogs"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setTableBlogs({
                            blogs: response.data.data.blogs,
                            meta: response.data.meta ?? null,
                        })
                    );
                });
            },
        }),
        fetchBlog: builder.query<ApiResponseType, FetchBlogPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/blog/${formData.id}`,
                    method: "get",
                }),
            providesTags: ["Blogs"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setBlog(response.data.data.blog));
                });
            },
        }),
        createBlog: builder.mutation<ApiResponseType, CreateBlogPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/blog`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Blogs"],
            transformErrorResponse: (error: any) => error.data,
        }),
        updateBlog: builder.mutation<ApiResponseType, UpdateBlogPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/blog/${formData?.id}`,
                    method: "post",
                    apiMethod: "PUT",
                    body: formData,
                }),
            invalidatesTags: ["Blogs"],
            transformErrorResponse: (error: any) => error.data,
        }),
        deleteBlog: builder.mutation<ApiResponseType, DeleteBlogPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/blog/${formData.id}`,
                    method: "post",
                    apiMethod: "DELETE",
                    body: formData,
                }),
            invalidatesTags: ["Blogs"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchBlogsQuery,
    useFetchBlogQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogApi;
