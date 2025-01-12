import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export const pageApi = createApi({
    reducerPath: "pageApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Pages"],
    endpoints: (builder) => ({
        fetchPages: builder.query<any, string>({
            query: (string) =>
                createRequest({
                    url: `${SELLER_PREFIX}/stores/${string}/pages`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Pages"],
        }),
        createPage: builder.mutation<
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
                    url: `${SELLER_PREFIX}/stores/${data.storeId}/pages/store`,
                    method: "POST",
                    body: formData,
                });
            },
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Pages"],
        }),
    }),
});

export const { useFetchPagesQuery, useCreatePageMutation } = pageApi;
