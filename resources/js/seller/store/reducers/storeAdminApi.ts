import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import {
    StoreAdminFetchResponseType,
    CreateStoreAdminType,
    UpdateStoreAdminType,
} from "@type/storeAdminType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setAdmins } from "../slices/storeAdminSlice";

export interface AdminIdType {
    id: number;
}

export const storeAdminApi = createApi({
    reducerPath: "storeAdminApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Admins"],
    endpoints: (builder) => ({
        fetchAdmins: builder.query<StoreAdminFetchResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-admin`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Admins"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setAdmins({
                            admins: response?.data?.data?.store_admins,
                        })
                    );
                });
            },
        }),

        // create admin
        createAdmin: builder.mutation<ApiResponseType, CreateStoreAdminType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-admin`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Admins"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // update admin
        updateAdmin: builder.mutation<ApiResponseType, UpdateStoreAdminType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-admin/${formData.id}`,
                    method: "post",
                    apiMethod: "PUT",
                    body: formData,
                }),
            invalidatesTags: ["Admins"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // delete admin
        deleteAdmin: builder.mutation<ApiResponseType, AdminIdType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-admin/${formData.id}`,
                    method: "delete",
                    body: formData,
                }),
            invalidatesTags: ["Admins"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchAdminsQuery,
    useCreateAdminMutation,
    useUpdateAdminMutation,
    useDeleteAdminMutation,
} = storeAdminApi;
