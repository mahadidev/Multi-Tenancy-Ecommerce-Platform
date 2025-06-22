import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { OrdersApiResponse } from "@type/orderType";
import { ShipmentOrdersApiResponse } from "@type/shipmentOrdersType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { clearCartItems } from "../slices/cartSlice";
import { setOrders, setShipmentOrders } from "../slices/orderSlice";

export interface PlaceOrderPayloadType {
    name: string;
    email: string;
    phone: string;
    address: string;
    payment_method: string; // Limited to these values
    notes?: string; // Nullable field
    user_id: number;
}
export interface PlaceOrderNonUserPayloadType {
	id?: number | null;
	name?: string | null;
	phone?: string | null;
	email?: string | null;
	note?: string | null;
	address?: string | null;
	notes?: string; // Nullable field
	payment_method?: string; // Limited to these values
	status?: string; // Nullable field
	items: {
		product_id: number;
		qty: number;
		price: number;
		discount_amount: number;
        tax: number;
		variants?: {
			label: string;
			value: string;
			price: number;
		}[];
	}[];
}

export interface BulkShipmentOrderPayloadType {
    orders: number[];
}

export const orderApi = createApi({
	reducerPath: 'orderApi',
	baseQuery: baseQuery,
	tagTypes: ['Orders', 'Shipments'],
	endpoints: (builder) => ({
		updateOrderStatus: builder.mutation<any, any>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/orders/update/status/${formData?.id}`,
					method: 'post',
					apiMethod: 'PUT',
					body: formData,
				}),
			invalidatesTags: ['Orders'],
			transformErrorResponse: (error: any) => error.data,
		}),

		// place order
		placeOrder: builder.mutation<ApiResponseType, PlaceOrderPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/place-order`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Orders'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then(() => {
					dispatch(clearCartItems());
				});
			},
		}),
		// place order non user
		placeOrderNonUser: builder.mutation<
			ApiResponseType,
			PlaceOrderNonUserPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/place-order-non-user`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Orders'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, {  queryFulfilled }) {
				await queryFulfilled.then(() => {
					// dispatch(clearCartItems());
				});
			},
		}),
		// fetch orders
		fetchOrders: builder.query<OrdersApiResponse, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/orders`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Orders'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setOrders({ orders: response?.data?.data?.orders }));
				});
			},
		}),
		// fetch shipment orders
		fetchShipmentOrders: builder.query<ShipmentOrdersApiResponse, void>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/shipments`,
					method: 'get',
					body: formData,
				}),
			providesTags: ['Shipments'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setShipmentOrders({
							shipmentOrders: response?.data?.data?.shipments,
						})
					);
				});
			},
		}),

		bulkShipmentOrders: builder.mutation<any, BulkShipmentOrderPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/steadfast-courier/place-order`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['Orders'],
			transformErrorResponse: (error: any) => error.data,
		}),

		syncShipmentOrders: builder.query<ShipmentOrdersApiResponse, void>({
			query: () =>
				createRequest({
					url: `${PREFIX}/steadfast-courier/shipments/sync`,
					method: 'get',
				}),
			providesTags: ['Shipments'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
    useFetchOrdersQuery,
    useFetchShipmentOrdersQuery,
    useUpdateOrderStatusMutation,
    usePlaceOrderMutation,
    useBulkShipmentOrdersMutation,
    useSyncShipmentOrdersQuery,
    usePlaceOrderNonUserMutation
} = orderApi;
