import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import baseQueryWithReAuth, { createRequest } from "@seller/store/baseQueryWithReAuth";
import { setCartItems } from "./cartOrderPlacerSlice";
import {
    CartItemsFetchResponse,
    FetchCartItemsPayloadType,
    AddToCartPayloadType,
    UpdateCartPayloadType,
    CartIdType,
    CreateOrderPayloadType,
    OrderReceiptType,
} from "../types";

export const cartOrderPlacerApi = createApi({
    reducerPath: "cartOrderPlacerApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["CartItems", "OrderPlacerData"],
    endpoints: (builder) => ({
        // fetch cart list
        fetchCartItems: builder.query<
            CartItemsFetchResponse,
            FetchCartItemsPayloadType
        >({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/cart/items?user_id=${formData?.id}`,
                    method: "get",
                }),
            providesTags: ["CartItems"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setCartItems(response?.data?.data?.cart_items));
                });
            },
        }),

        // add to cart
        addToCart: builder.mutation<ApiResponseType, AddToCartPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/cart/add-items`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["CartItems"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // remove from cart
        removeCartItem: builder.mutation<ApiResponseType, CartIdType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/cart/delete/items`,
                    method: "post",
                    body: formData,
                    apiMethod: "DELETE",
                }),
            invalidatesTags: ["CartItems"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // update cart
        updateCart: builder.mutation<ApiResponseType, UpdateCartPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/cart/update/items`,
                    method: "post",
                    body: formData,
                    apiMethod: "PUT",
                }),
            invalidatesTags: ["CartItems"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // create order (non-user order)
        createOrder: builder.mutation<
            { status: number; data: OrderReceiptType },
            CreateOrderPayloadType
        >({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/orders/create-non-user-order`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["OrderPlacerData"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // fetch products for order placer
        fetchOrderPlacerProducts: builder.query<
            { status: number; data: { products: any[] } },
            { search?: string; category_id?: string; page?: number }
        >({
            query: (params) => {
                const queryString = new URLSearchParams(
                    Object.entries(params || {}).filter(([_, value]) => value != null)
                ).toString();
                return createRequest({
                    url: `${PREFIX}/products${queryString ? `?${queryString}` : ""}`,
                    method: "get",
                });
            },
            providesTags: ["OrderPlacerData"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // search customers
        searchCustomers: builder.query<
            { status: number; data: { customers: any[] } },
            { search: string }
        >({
            query: (params) =>
                createRequest({
                    url: `${PREFIX}/customers/search?q=${params.search}`,
                    method: "get",
                }),
            providesTags: ["OrderPlacerData"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchCartItemsQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useRemoveCartItemMutation,
    useCreateOrderMutation,
    useFetchOrderPlacerProductsQuery,
    useSearchCustomersQuery,
} = cartOrderPlacerApi;