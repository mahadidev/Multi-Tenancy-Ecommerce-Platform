import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { CustomerDataType, CustomerType } from "@type/customersType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setCustomers } from "../slices/customerSlice";

export interface CustomerFetchResponseType extends ApiResponseType {
    data: CustomerDataType;
}

export const customerApi = createApi({
    reducerPath: "customerApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Customers"],
    endpoints: (builder) => ({
        fetchCustomers: builder.query<CustomerFetchResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/customers`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Customers"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setCustomers({
                            customers: response?.data?.data?.customers,
                        })
                    );
                });
            },
        }),

        // create customer
        createCustomer: builder.mutation<ApiResponseType, CustomerType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/customers`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Customers"],
            transformErrorResponse: (error: any) => error.data,
        }),
        // update customer
        updateCustomer: builder.mutation<ApiResponseType, CustomerType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/customers`,
                    method: "post",
                    apiMethod: "PUT",
                    body: formData,
                }),
            invalidatesTags: ["Customers"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchCustomersQuery,
    useUpdateCustomerMutation,
    useCreateCustomerMutation,
} = customerApi;
