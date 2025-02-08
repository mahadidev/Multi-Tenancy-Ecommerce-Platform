import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { BlogType } from "@type/blogType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setNotifications } from "../slices/notificationSlice";

export interface BlogsFetchResponseType extends ApiResponseType {
    data: {
        blogs: BlogType[];
    };
}

export interface FetchBlogPayloadType {
    id: number | string;
}

export interface CreateBlogPayloadType {
    title: string;
    slug: string;
    content: string;
    category_id: number;
    image: string;
}

export interface UpdateBlogPayloadType {
    id: number;
    title?: string;
    slug?: string;
    status?: string;
    category_id?: number;
    content?: string;
    image?: string;
}

export interface DeleteBlogPayloadType {
    id: number | string;
}

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        fetchNotifications: builder.query<
            ApiResponseType,
            FetchBlogPayloadType
        >({
            query: () =>
                createRequest({
                    url: `${PREFIX}/notifications`,
                    method: "get",
                }),
            providesTags: ["Notifications"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setNotifications(response.data.data));
                });
            },
        }),
    }),
});

export const { useFetchNotificationsQuery } = notificationApi;
