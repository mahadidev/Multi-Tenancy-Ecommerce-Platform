import { createApi } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { NotificationsResponseType } from "@type/notification";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { setNotifications } from "../slices/notificationSlice";

export interface NotificationIdType {
    id: string;
}
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
    }),
});

export const { useFetchNotificationsQuery, useFetchSingleNotificationQuery } =
    notificationApi;
