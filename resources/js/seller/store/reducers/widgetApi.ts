import { WidgetType } from "@/seller/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export const widgetApi = createApi({
    reducerPath: "widgetApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Widgets"],
    endpoints: (builder) => ({
        fetchWidgets: builder.query<
            WidgetType[],
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
                    url: `${SELLER_PREFIX}/stores/pages/${data.pageId}/widgets/${data.widgetId}`,
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

export const { useFetchWidgetsQuery, useDeleteWidgetMutation } = widgetApi;
