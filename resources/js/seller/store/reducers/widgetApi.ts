import { ResponseType } from "@/seller/types/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";
import { setWidgets } from "../slices/pageSlice";

export interface CreateWidgetPayloadType {
    name: string;
    label: string;
    inputs?: {
        name: string;
        label: string;
        placeholder?: string;
        value?: string;
        required?: boolean;
        type:
            | "text"
            | "image"
            | "file"
            | "textarea"
            | "email"
            | "tel"
            | "array"
            | "color";
        items?: {
            name: string;
            label: string;
            placeholder?: string;
            value: string;
            required: boolean;
            type:
                | "text"
                | "image"
                | "file"
                | "textarea"
                | "email"
                | "tel"
                | "array"
                | "color";
        }[];
    }[];
}

export const widgetApi = createApi({
    reducerPath: "widgetApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Widgets"],
    endpoints: (builder) => ({
        fetchWidgets: builder.query<
            ResponseType,
            {
                pageId: number | string;
            }
        >({
            query: (data) =>
                createRequest({
                    url: `${SELLER_PREFIX}/stores/pages/${data.pageId}/widgets`,
                    method: "get",
                }),
            transformErrorResponse: (error: any) => error.data,
            providesTags: ["Widgets"],
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setWidgets(response.data.data.widgets));
                });
            },
        }),
        createWidget: builder.mutation<
            ResponseType,
            {
                pageId: number | string;
                formData: CreateWidgetPayloadType;
            }
        >({
            query: (data) =>
                createRequest({
                    url: `${SELLER_PREFIX}/stores/pages/${data.pageId}/widgets/store`,
                    method: "POST",
                    body: data.formData,
                }),
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Widgets"],
        }),
        deleteWidget: builder.mutation<
            any,
            {
                widgetId: number | string;
                pageId: number | string;
            }
        >({
            query: (data) => {
                return createRequest({
                    url: `${SELLER_PREFIX}/stores/pages/${data.pageId}/widgets/delete/${data.widgetId}`,
                    method: "POST",
                    body: {
                        _method: "DELETE",
                    },
                });
            },
            transformResponse: (response: any) => response,
            transformErrorResponse: (error: any) => error.data,
            invalidatesTags: ["Widgets"],
        }),
    }),
});

export const {
    useFetchWidgetsQuery,
    useCreateWidgetMutation,
    useDeleteWidgetMutation,
} = widgetApi;
