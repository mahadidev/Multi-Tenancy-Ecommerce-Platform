import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setCustomers } from "./customerSlice";
import type { 
  CustomersResponse, 
  CustomerResponse, 
  CreateCustomerPayload, 
  UpdateCustomerPayload, 
  DeleteCustomerPayload 
} from "../types";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Customers"],
  endpoints: (builder) => ({
    fetchCustomers: builder.query<CustomersResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/customers`,
          method: "get",
        }),
      providesTags: ["Customers"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setCustomers({
              customers: response?.data?.data?.customers || [],
            })
          );
        });
      },
    }),

    // create customer
    createCustomer: builder.mutation<CustomerResponse, CreateCustomerPayload>({
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
    updateCustomer: builder.mutation<CustomerResponse, UpdateCustomerPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/customers/${formData.id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData,
        }),
      invalidatesTags: ["Customers"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // delete customer
    deleteCustomer: builder.mutation<CustomerResponse, DeleteCustomerPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/customers/${formData.id}`,
          method: "delete",
          body: formData,
        }),
      invalidatesTags: ["Customers"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;