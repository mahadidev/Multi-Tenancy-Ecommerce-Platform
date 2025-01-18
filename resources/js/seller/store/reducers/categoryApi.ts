import { ResponseType } from "@/seller/types/api";
import { CategoryType } from "@/seller/types/store";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export interface StoreCategoryPayloadType {
    type: string;
    name: string;
    slug: string;
    parent_id?: number;
}

export interface UpdateCategoryPayloadType {
    name?: string;
    slug?: string;
    type?: "product" | "post" | "blog";
    parent_id?: number;
}

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Categories"],
    endpoints: (builder) => ({
        fetchCategories: builder.query<any, void>({
            query: () => {
                return createRequest({
                    url: `${SELLER_PREFIX}/category`,
                    method: "GET",
                });
            },
            transformResponse: (response: ResponseType) => {
                return response;
            },
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Categories"],
        }),
        storeCategory: builder.mutation<
            any,
            {
                formData: StoreCategoryPayloadType;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/category`,
                    method: "POST",
                    body: data.formData,
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Categories"],
        }),
        UpdateCategory: builder.mutation<
            any,
            {
                formData: UpdateCategoryPayloadType;
                categoryId: number;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/category/${data.categoryId}`,
                    method: "POST",
                    body: {
                        _method: "PUT",
                        ...data.formData,
                    },
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Categories"],
        }),
        deleteCategory: builder.mutation<
            any,
            {
                categoryId: number;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/category/${data.categoryId}`,
                    method: "POST",
                    body: {
                        _method: "DELETE",
                    },
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Categories"],
        }),
    }),
});

export const {
    useFetchCategoriesQuery,
    useStoreCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
