import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export const settingApi = createApi({
    reducerPath: "settingApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: [],
    endpoints: (builder) => ({
        fetchSettings: builder.query<any, void>({
            query: () =>
                createRequest({
                    url: `${SELLER_PREFIX}/current-store`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
        updateSettings: builder.mutation<any, any>({
            query: (data) => {
                const formData = new FormData();
                Object.keys(data).map((key: any) => {
                    formData.append(key, data[key]);
                });

                return createRequest({
                    url: `/themes`,
                    method: "get",
                    body: formData,
                });
            },
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const { useUpdateSettingsMutation, useFetchSettingsQuery } = settingApi;
