import { createApi } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@seller/seller_env";
import { NotificationsResponseType } from "@type/notification";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { setNotifications } from "../slices/notificationsDataSlice";

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
    }),
});

export const { useFetchNotificationsQuery } = notificationApi;
