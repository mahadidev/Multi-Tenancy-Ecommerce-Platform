import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { ProductType } from "@type/productType";
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

export interface ProductsFetchResponseType extends ApiResponseType {
    data: {
        products: ProductType[];
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

export interface OrderPlacerProductFilters {
    search?: string;
    category_id?: string;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

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
                    url: `${PREFIX}/product${queryString ? `?${queryString}` : ""}`,
                    method: "get",
                });
            },
            providesTags: ["OrderPlacerData"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // fetch products for order placer with table filters (for generic table)
        fetchOrderPlacerProductsTable: builder.query<ProductsFetchResponseType, OrderPlacerProductFilters>({
            query: (filters) => {
                const params = new URLSearchParams();
                
                // Add filters to URL params
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        // Skip empty search values to keep URL clean
                        if (key === 'search' && value === '') return;
                        params.append(key, String(value));
                    }
                });
                
                return createRequest({
                    url: `${PREFIX}/product?${params.toString()}`,
                    method: 'get',
                });
            },
            providesTags: ['OrderPlacerData'],
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
    useFetchOrderPlacerProductsTableQuery,
    useSearchCustomersQuery,
} = cartOrderPlacerApi;