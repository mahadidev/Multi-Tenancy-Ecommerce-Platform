import { WidgetInputType } from "@/seller/types";
import { ResponseType } from "@/seller/types/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";
import {
    setPage,
    setPages,
    setPagesMeta,
    setPageTypes,
    setWidgets,
} from "../slices/pageSlice";
import { setSocialMedias } from "../slices/socialMediaSlice";

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
        fetchPages: builder.query<
            ResponseType,
            {
                storeId: number | string;
            }
        >({
            query: (data) =>
                createRequest({
                    url: `${SELLER_PREFIX}/stores/${data.storeId}/pages`,
                    method: "get",
                }),
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Pages"],
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setPages(response.data.data.pages));
                    dispatch(setPagesMeta(response.data.meta));
                });
            },
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
                    dispatch(setWidgets(response.data.data.page.widgets));
                    dispatch(
                        setSocialMedias(response.data.data.page.social_media)
                    );
                });
            },
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
        deletePage: builder.mutation<
            ResponseType,
            {
                storeId: number | string;
                pageId: number | string;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/stores/${data.storeId}/pages/delete/${data.pageId}`,
                    method: "POST",
                    body: {
                        _method: "DELETE",
                    },
                });
            },
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Pages"],
        }),
        fetchPageTypes: builder.query<ResponseType, void>({
            query: () =>
                createRequest({
                    url: `/page-types`,
                    method: "get",
                }),
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["PageTypes"],
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setPageTypes(response.data.data.page_types));
                });
            },
        }),
    }),
});

export const {
    useFetchPagesQuery,
    useCreatePageMutation,
    useFetchPageQuery,
    useUpdatePageMutation,
    useFetchPageTypesQuery,
    useDeletePageMutation,
} = pageApi;
