import { createApi } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { baseQuery, createRequest } from "@seller/store/baseQueryWithReAuth";
import { setNotifications } from "./notificationSlice";
import { NotificationIdType, NotificationsResponseType } from "../types";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQuery,
    tagTypes: ["NotificationsData"],
    endpoints: (builder) => ({
        // fetch notifications
        fetchNotifications: builder.query<NotificationsResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/notifications`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["NotificationsData"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setNotifications({
                            notifications: response?.data?.data?.notifications,
                        })
                    );
                });
            },
        }),

        // fetch single notification
        fetchSingleNotification: builder.query<
            ApiResponseType,
            NotificationIdType
        >({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/notifications/${formData?.id}`,
                    method: "get",
                }),
            providesTags: ["NotificationsData"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // mark notification as read
        markNotificationRead: builder.mutation<
            ApiResponseType,
            NotificationIdType
        >({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/notifications/${formData?.id}/read`,
                    method: "post",
                }),
            invalidatesTags: ["NotificationsData"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // mark all notifications as read
        markAllNotificationsRead: builder.mutation<ApiResponseType, void>({
            query: () =>
                createRequest({
                    url: `${API_URL}/notifications/mark-all-read`,
                    method: "post",
                }),
            invalidatesTags: ["NotificationsData"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // delete notification
        deleteNotification: builder.mutation<
            ApiResponseType,
            NotificationIdType
        >({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/notifications/${formData?.id}`,
                    method: "delete",
                }),
            invalidatesTags: ["NotificationsData"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchNotificationsQuery,
    useFetchSingleNotificationQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
    useDeleteNotificationMutation,
} = notificationApi;