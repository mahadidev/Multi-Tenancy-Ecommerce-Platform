import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";
import { addStore, setCurrentStore } from "../slices/authSlice";
import {
    setStore as setOnboardStore,
    setStore,
} from "../slices/storeOnboardSlice";

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
            async onQueryStarted(_formData, { dispatch, queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled;
                    dispatch(setStore(response.data.stores));
                } catch (err) {
                    /* empty */
                }
            },
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
        fetchCurrentStore: builder.query<any, void>({
            query: () =>
                createRequest({
                    url: `${SELLER_PREFIX}/current-store`,
                    method: "get",
                }),
            async onQueryStarted(_formData, { dispatch, queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled;
                    dispatch(setCurrentStore(response.data));
                } catch (err) {
                    /* empty */
                }
            },
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
        createStore: builder.mutation<
            any,
            {
                name: string;
                domain: string;
            }
        >({
            query: (formData) =>
                createRequest({
                    url: `${SELLER_PREFIX}/store`,
                    method: "post",
                    body: formData,
                }),
            async onQueryStarted(_formData, { dispatch, queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled;

                    dispatch(setCurrentStore(response.data));
                    dispatch(setOnboardStore(response.data));
                } catch (err) {
                    /* empty */
                }
            },
            transformResponse: (response: { data: any }) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
        updateStore: builder.mutation<
            any,
            {
                storeId: string;
                formData: any;
            }
        >({
            query: (data) => {
                const formData = new FormData();
                Object.keys(data.formData).map((key: any) => {
                    formData.append(key, data.formData[key]);
                });

                return createRequest({
                    url: `${SELLER_PREFIX}/store/${data.storeId}`,
                    method: "POST",
                    body: formData,
                });
            },
            transformResponse: (response: { data: any }) => response,
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_formData, { dispatch, queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled;
                    dispatch(setCurrentStore(response.data));
                    dispatch(setOnboardStore(response.data));
                } catch (err) {
                    /* empty */
                }
            },
        }),
        switchStore: builder.mutation<
            any,
            {
                storeId: string;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/switch-store`,
                    method: "POST",
                    body: {
                        store_id: data.storeId,
                    },
                });
            },
            transformResponse: (response: { data: any }) => response,
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_formData, { dispatch, queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled;
                    dispatch(setCurrentStore(response.data));
                } catch (err) {
                    /* empty */
                }
            },
        }),
    }),
});

export const {
    useFetchStoresQuery,
    useFetchCurrentStoreQuery,
    useCreateStoreMutation,
    useUpdateStoreMutation,
    useSwitchStoreMutation,
} = storeApi;
