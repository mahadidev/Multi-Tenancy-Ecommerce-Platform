import { ResponseType } from "@/seller/types/api";
import { CategoryType } from "@/seller/types/store";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export interface StoreProductPayloadType {
    name: string;
    slug: string;
    category_id: number;
    price: number;
}

export interface UpdateCategoryPayloadType {
    name: string;
    slug: string;
    category_id: number;
    price: number;
    description: string;
}

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Categories", "Products"],
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
        storeProduct: builder.mutation<
            any,
            {
                formData: StoreProductPayloadType;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/category`,
                    method: "POST",
                    body: data.formData,
                });
            },
            transformResponse: (response: ResponseType) => response,
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

export const { useStoreProductMutation } = productApi;
