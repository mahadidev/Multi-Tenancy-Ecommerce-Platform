import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { OrdersApiResponse } from "@type/orderType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { clearCartItems } from "../slices/cartSlice";
import { setOrders } from "../slices/orderSlice";

export interface PlaceOrderPayloadType {
    name: string;
    email: string;
    phone: string;
    address: string;
    payment_method: string; // Limited to these values
    notes?: string; // Nullable field
    user_id: number;
}

export interface BulkShipmentOrderPayloadType {
    orders: number[];
}

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

        // place order
        placeOrder: builder.mutation<ApiResponseType, PlaceOrderPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/place-order`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Orders"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then(() => {
                    dispatch(clearCartItems());
                });
            },
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

        bulkShipmentOrders: builder.mutation<any, BulkShipmentOrderPayloadType>(
            {
                query: (formData) =>
                    createRequest({
                        url: `${PREFIX}/steadfast-courier/place-order`,
                        method: "post",
                        body: formData,
                    }),
                invalidatesTags: ["Orders"],
                transformErrorResponse: (error: any) => error.data,
            }
        ),
    }),
});

export const {
    useFetchOrdersQuery,
    useUpdateOrderStatusMutation,
    usePlaceOrderMutation,
    useBulkShipmentOrdersMutation,
} = orderApi;
