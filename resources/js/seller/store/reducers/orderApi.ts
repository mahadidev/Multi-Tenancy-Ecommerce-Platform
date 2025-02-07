import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { OrdersApiResponse } from "@type/orderType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { setOrders } from "../slices/orderSlice";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: baseQuery,
    tagTypes: ["Orders"],
    endpoints: (builder) => ({
        updateOrderStatus: builder.mutation<any, any>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/orders/update/status/${formData?.id}`,
                    method: "post",
                    apiMethod: "PUT",
                    body: formData,
                }),
            invalidatesTags: ["Orders"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // fetch orders
        fetchOrders: builder.query<OrdersApiResponse, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/orders`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Orders"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setOrders({ orders: response?.data?.data?.orders })
                    );
                });
            },
        }),
    }),
});

export const { useFetchOrdersQuery, useUpdateOrderStatusMutation } = orderApi;
