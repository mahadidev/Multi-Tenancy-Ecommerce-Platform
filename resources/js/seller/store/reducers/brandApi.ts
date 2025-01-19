import { ResponseType } from "@/seller/types/api";
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
    tagTypes: ["Brands"],
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
            invalidatesTags: ["Brands"],
        }),
        updateBrand: builder.mutation<
            any,
            {
                formData: UpdateCategoryPayloadType | any;
                brandId: number;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/brand/${data.brandId}`,
                    method: "POST",
                    body: {
                        ...data.formData,
                        _method: "PUT",
                    },
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Brands"],
        }),
        deleteBrand: builder.mutation<
            any,
            {
                brandId: number;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/brand/${data.brandId}`,
                    method: "POST",
                    body: {
                        _method: "DELETE",
                    },
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Brands"],
        }),
    }),
});

export const {
    useFetchBrandsQuery,
    useStoreBrandMutation,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
} = brandApi;
