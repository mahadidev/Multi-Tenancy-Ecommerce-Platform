import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export const storeApi = createApi({
    reducerPath: "storeApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: [],
    endpoints: (builder) => ({
        fetchStores: builder.query<any, void>({
            query: () =>
                createRequest({
                    url: `${SELLER_PREFIX}/get-stores`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
        fetchCurrentStore: builder.query<any, void>({
            query: () =>
                createRequest({
                    url: `${SELLER_PREFIX}/current-store`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
        createStore: builder.mutation<
            any,
            {
                name: string;
            }
        >({
            query: (formData) =>
                createRequest({
                    url: `/onboarding/create-store`,
                    method: "post",
                    body: formData,
                }),
            transformResponse: (response: { data: any }) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchStoresQuery,
    useFetchCurrentStoreQuery,
    useCreateStoreMutation,
} = storeApi;
