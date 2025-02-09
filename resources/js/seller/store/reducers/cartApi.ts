import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { CartItemsDataType } from "@type/cartType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setCartItems } from "../slices/cartSlice";

export interface CartItemsFetchResponse extends ApiResponseType {
    data: CartItemsDataType;
}

export interface FetchCartItemsPayloadType {
    id: number | string;
}

export interface AddToCartPayloadType {
    user_id: string | number;
    product_id: string | number;
    qty: string | number;
}

export interface UpdateCartPayloadType extends CartIdType {
    qty: string | number;
}

export interface CartIdType {
    cart_id: string | number;
}

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["CartItems"],
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
                    // dispatch(clearCartItems());
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
    }),
});

export const {
    useFetchCartItemsQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useRemoveCartItemMutation,
} = cartApi;
