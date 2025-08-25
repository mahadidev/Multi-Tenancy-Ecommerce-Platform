import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setCustomers } from "./customerSlice";
import type { 
  CustomersResponse, 
  CustomerResponse, 
  CreateCustomerPayload, 
  UpdateCustomerPayload, 
  DeleteCustomerPayload,
  CustomerFilters
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

    // Fetch customers with table filters (for generic table)
    fetchCustomersTable: builder.query<CustomersResponse, CustomerFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Skip empty search values to keep URL clean
            if (key === 'search' && value === '') return;
            params.append(key, String(value));
          }
        });
        
        return createRequest({
          url: `${PREFIX}/customers?${params.toString()}`,
          method: "get",
        });
      },
      providesTags: ["Customers"],
      transformErrorResponse: (error: any) => error.data,
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
  useFetchCustomersTableQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;