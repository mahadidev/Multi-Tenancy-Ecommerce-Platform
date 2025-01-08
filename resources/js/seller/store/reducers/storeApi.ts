import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";
import { setCurrentStore } from "../slices/storeSlice";

export const storeApi = createApi({
    reducerPath: "storeApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Stores", "CurrentStore"],
    endpoints: (builder) => ({
        fetchStores: builder.query<any, void>({
            query: () =>
                createRequest({
                    url: `${SELLER_PREFIX}/get-stores`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Stores"],
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
                    dispatch(setCurrentStore(response.data.store));
                } catch (err) {
                    /* empty */
                }
            },
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["CurrentStore"],
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
            transformResponse: (response: { data: any }) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Stores"],
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
            invalidatesTags: ["CurrentStore", "Stores"],
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
            invalidatesTags: ["Stores"],
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
