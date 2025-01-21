import { SettingsType } from "@/seller/types";
import { ResponseType } from "@/seller/types/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";
import { setSocialMedias } from "../slices/socialMediaSlice";
import { setCurrentStore } from "../slices/storeSlice";

export interface UpdateStorePayloadType {
    name?: string;
    slug?: string;
    domain?: string;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    status?: 1 | 0;
    type?: string;
    description?: string | null;
    currency?: string;
    logo?: string;
    dark_logo?: string;
    primary_color?: null | string;
    secondary_color?: null | string;
    theme_id?: number | "none";
    settings?: SettingsType | null;
}

export const storeApi = createApi({
    reducerPath: "storeApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Stores", "CurrentStore"],
    endpoints: (builder) => ({
        fetchStores: builder.query<ResponseType, void>({
            query: () =>
                createRequest({
                    url: `${SELLER_PREFIX}/get-stores`,
                    method: "get",
                }),
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Stores"],
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setCurrentStore(response.data.data.current_store));
                    dispatch(
                        setSocialMedias(
                            response.data.data.current_store.social_media
                        )
                    );
                });
            },
        }),
        fetchCurrentStore: builder.query<
            ResponseType,
            {
                responseType?: "store";
            } | void
        >({
            query: () =>
                createRequest({
                    url: `${SELLER_PREFIX}/current-store`,
                    method: "get",
                }),
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setCurrentStore(response.data.data.current_store));
                    dispatch(
                        setSocialMedias(
                            response.data.data.current_store.social_media
                        )
                    );
                });
            },
            transformResponse: (response: any, _meta, arg) => {
                if (arg && arg.responseType == "store") {
                    return response.data.store;
                } else {
                    return response;
                }
            },
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
                storeId: number | string;
                formData: UpdateStorePayloadType;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/store/${data.storeId}`,
                    method: "POST",
                    body: {
                        ...data.formData,
                        _method: "PUT",
                    },
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
