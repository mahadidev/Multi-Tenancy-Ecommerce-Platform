import { ResponseType } from "@/seller/types/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export interface StoreProductPayloadType {
    name: string;
    slug: string;
    category_id: number;
    price: number;
    thumbnail: string;
}

export interface UpdateProductPayloadType {
    name: string;
    slug: string;
    category_id?: number;
    price: number;
    thumbnail: string;
}

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Products"],
    endpoints: (builder) => ({
        fetchProducts: builder.query<any, void>({
            query: () => {
                return createRequest({
                    url: `${SELLER_PREFIX}/product`,
                    method: "GET",
                });
            },
            transformResponse: (response: ResponseType) => {
                return response;
            },
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Products"],
        }),
        storeProduct: builder.mutation<
            any,
            {
                formData: StoreProductPayloadType;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/product`,
                    method: "POST",
                    body: data.formData,
                });
            },
            transformResponse: (response: ResponseType) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Products"],
        }),
        UpdateProduct: builder.mutation<
            any,
            {
                formData: UpdateProductPayloadType;
                productId: number;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/category/${data.productId}`,
                    method: "POST",
                    body: {
                        _method: "PUT",
                        ...data.formData,
                    },
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Products"],
        }),
        deleteProduct: builder.mutation<
            any,
            {
                productId: number;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/product/${data.productId}`,
                    method: "POST",
                    body: {
                        _method: "DELETE",
                    },
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useFetchProductsQuery,
    useStoreProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
