import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { VendorType } from "@type/vendorType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setTableVendors } from "../slices/vendorSlice";

export interface VendorsFetchResponse extends ApiResponseType {
    data: {
        vendors: VendorType[];
    };
}

export interface CreateVendorPayloadType {
    name: string;
    phone?: string;
    address?: string;
    description?: string;
    email?: string;
    contact_person?: string;
}

export interface UpdateVendorPayloadType {
    id: number;
    name?: string;
    phone?: string;
    address?: string;
    description?: string;
    email?: string;
    contact_person?: string;
}

export interface DeleteVendorPayloadType {
    id: number;
}

export const vendorApi = createApi({
    reducerPath: "vendorApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Vendors"],
    endpoints: (builder) => ({
        fetchVendors: builder.query<VendorsFetchResponse, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/vendors`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Vendors"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setTableVendors({
                            vendors: response.data.data.vendors,
                            meta: response.data.meta ?? null,
                        })
                    );
                });
            },
        }),
        createVendor: builder.mutation<ApiResponseType, CreateVendorPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/vendors`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Vendors"],
            transformErrorResponse: (error: any) => error.data,
        }),
        updateVendor: builder.mutation<ApiResponseType, UpdateVendorPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/vendors/${formData.id}`,
                    method: "post",
                    apiMethod: "PUT",
                    body: formData,
                }),
            invalidatesTags: ["Vendors"],
            transformErrorResponse: (error: any) => error.data,
        }),
        deleteVendor: builder.mutation<ApiResponseType, DeleteVendorPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/vendors/${formData.id}`,
                    method: "post",
                    apiMethod: "delete",
                    body: formData,
                }),
            invalidatesTags: ["Vendors"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchVendorsQuery,
    useCreateVendorMutation,
    useUpdateVendorMutation,
    useDeleteVendorMutation,
} = vendorApi;