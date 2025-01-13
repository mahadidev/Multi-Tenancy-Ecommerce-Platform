import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export const pageApi = createApi({
    reducerPath: "pageApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Pages", "Page"],
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
        fetchPage: builder.query<
            any,
            {
                storeId: string;
                pageId: string;
            }
        >({
            query: (props) =>
                createRequest({
                    url: `${SELLER_PREFIX}/stores/${props.storeId}/pages/${props.pageId}`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Page"],
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
        updatePage: builder.mutation<
            any,
            {
                storeId: string;
                pageId: string;
                formData: any;
            }
        >({
            query: (data) => {
                data.formData["_method"] = "put";
                return createRequest({
                    url: `${SELLER_PREFIX}/stores/${data.storeId}/pages/update/${data.pageId}`,
                    method: "POST",
                    body: data.formData,
                });
            },
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Page"],
        }),
    }),
});

export const {
    useFetchPagesQuery,
    useCreatePageMutation,
    useFetchPageQuery,
    useUpdatePageMutation,
} = pageApi;
