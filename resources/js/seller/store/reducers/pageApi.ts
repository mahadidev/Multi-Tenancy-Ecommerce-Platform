import { WidgetInputType } from "@/seller/types";
import { ResponseType } from "@/seller/types/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";
import { setPage } from "../slices/pageSlice";

export interface CreatePagePayloadType {
    name: string;
    slug: string;
    title: string;
    is_active: boolean;
}

export interface UpdatePagePayloadType {
    name?: string;
    type?: string | "home" | "about" | "blog" | "contact";
    slug?: string;
    title?: string;
    is_active?: 0 | 1;
    widgets?: {
        name: string;
        label: string;
        inputs: WidgetInputType[];
    }[];
}

export const pageApi = createApi({
    reducerPath: "pageApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Pages", "Page", "PageTypes"],
    endpoints: (builder) => ({
        fetchPages: builder.query<ResponseType, string>({
            query: (string) =>
                createRequest({
                    url: `${SELLER_PREFIX}/stores/${string}/pages`,
                    method: "get",
                }),
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Pages"],
        }),
        fetchPage: builder.query<
            ResponseType,
            {
                storeId: number | string;
                pageId: number | string;
            }
        >({
            query: (props) =>
                createRequest({
                    url: `${SELLER_PREFIX}/stores/${props.storeId}/pages/${props.pageId}`,
                    method: "get",
                }),
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Page"],
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setPage(response.data.data.page));
                });
            },
        }),
        getPage: builder.mutation<
            any,
            {
                storeId: number | string;
                pageId: number | string;
            }
        >({
            query: (props) =>
                createRequest({
                    url: `${SELLER_PREFIX}/stores/${props.storeId}/pages/${props.pageId}`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
        }),
        createPage: builder.mutation<
            any,
            {
                storeId: number | string;
                formData: CreatePagePayloadType;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/stores/${data.storeId}/pages/store`,
                    method: "POST",
                    body: data.formData,
                });
            },
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Pages"],
        }),
        updatePage: builder.mutation<
            any,
            {
                storeId: number | string;
                pageId: number | string;
                formData: UpdatePagePayloadType;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/stores/${data.storeId}/pages/update/${data.pageId}`,
                    method: "POST",
                    body: {
                        ...data.formData,
                        _method: "put",
                    },
                });
            },
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Page"],
        }),
        fetchPageTypes: builder.query<any, void>({
            query: () =>
                createRequest({
                    url: `/page-types`,
                    method: "get",
                }),
            transformResponse: (response) => response,
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["PageTypes"],
        }),
    }),
});

export const {
    useFetchPagesQuery,
    useCreatePageMutation,
    useFetchPageQuery,
    useUpdatePageMutation,
    useGetPageMutation,
    useFetchPageTypesQuery,
} = pageApi;
