import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { CategoryType } from "@type/categoryType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import {
    setTableBlogCategories,
    setTableProductCategories,
} from "../slices/categorySlice";
// import { setTableCategories } from '../slices/categorySlice';

export interface CategoriesFetchResponse extends ApiResponseType {
    data: {
        categories: CategoryType[];
    };
}

export interface CreateCategoryPayloadType {
    name: string;
    slug?: string;
    parent_id?: string;
}

export interface UpdateCategoryPayloadType {
    id: number;
    name?: string;
    slug?: string;
    type?: "product" | "post" | "blog";
    parent_id?: number;
}

export interface DeleteCategoryPayloadType {
    id: number;
}

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Categories", "ProductCategories", "BlogCategories"],
    endpoints: (builder) => ({
        fetchProductCategories: builder.query<CategoriesFetchResponse, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/category?type=product`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["ProductCategories"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setTableProductCategories({
                            categories: response.data.data.categories,
                            meta: response.data.meta ?? null,
                        })
                    );
                });
            },
        }),
        fetchBlogCategories: builder.query<CategoriesFetchResponse, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/category?type=post`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["BlogCategories"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setTableBlogCategories({
                            categories: response.data.data.categories,
                            meta: response.data.meta ?? null,
                        })
                    );
                });
            },
        }),
        createCategory: builder.mutation<
            ApiResponseType,
            CreateCategoryPayloadType
        >({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/category`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Categories"],
            transformErrorResponse: (error: any) => error.data,
        }),
        updateCategory: builder.mutation<
            ApiResponseType,
            UpdateCategoryPayloadType
        >({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/category/${formData.id}`,
                    method: "post",
                    apiMethod: "PUT",
                    body: formData,
                }),
            invalidatesTags: ["Categories"],
            transformErrorResponse: (error: any) => error.data,
        }),
        deleteCategory: builder.mutation<
            ApiResponseType,
            DeleteCategoryPayloadType
        >({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/category/${formData.id}`,
                    method: "post",
                    apiMethod: "delete",
                    body: formData,
                }),
            invalidatesTags: ["Categories"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchProductCategoriesQuery,
    useFetchBlogCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
