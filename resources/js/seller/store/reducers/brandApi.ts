import { ResponseType } from "@/seller/types/api";
import { CategoryType } from "@/seller/types/store";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export interface StoreBrandPayloadType {
    name: string;
    slug: string;
    image: any;
}

export interface UpdateCategoryPayloadType {
    name?: string;
    slug?: string;
    image?: any;
}

export const brandApi = createApi({
    reducerPath: "brandApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Categories", "Brands"],
    endpoints: (builder) => ({
        fetchBrands: builder.query<any, void>({
            query: () => {
                return createRequest({
                    url: `${SELLER_PREFIX}/brand`,
                    method: "GET",
                });
            },
            transformResponse: (response: ResponseType) => {
                return response;
            },
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Brands"],
        }),
        storeBrand: builder.mutation<
            any,
            {
                formData: StoreBrandPayloadType | any;
            }
        >({
            query: (data) => {
                const formData = new FormData();
                Object.keys(data.formData).map((key: string) => {
                    formData.append(key, data.formData[key]);
                });

                return createRequest({
                    url: `${SELLER_PREFIX}/brand`,
                    method: "POST",
                    body: formData,
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Categories"],
        }),
        updateBrand: builder.mutation<
            any,
            {
                formData: UpdateCategoryPayloadType | any;
                brandId: number;
            }
        >({
            query: (data) => {
                const formData = new FormData();
                Object.keys(data.formData).map((key: string) => {
                    formData.append(key, data.formData[key]);
                });
                formData.append("_method", "PUT");

                return createRequest({
                    url: `${SELLER_PREFIX}/brand`,
                    method: "POST",
                    body: formData,
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
    useFetchBrandsQuery,
    useStoreBrandMutation,
    useUpdateBrandMutation,
    useDeleteCategoryMutation,
} = brandApi;
