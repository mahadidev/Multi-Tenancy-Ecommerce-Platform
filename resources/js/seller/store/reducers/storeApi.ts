import { API_URL } from "@/env";
import { SigninPayloadType, SigninResponseType } from "@/type/sellers/singin";
import { SingupPayloadType, SingupResponseType } from "@/type/sellers/singup";
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
    }),
});

export const { useFetchStoresQuery, useFetchCurrentStoreQuery } = storeApi;
