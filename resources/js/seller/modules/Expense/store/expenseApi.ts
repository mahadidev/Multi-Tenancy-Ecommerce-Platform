import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setExpenses, setVendors } from "./expenseSlice";
import type { 
  ExpensesResponse, 
  VendorsResponse,
  CreateExpensePayload, 
  UpdateExpensePayload, 
  DeleteExpensePayload,
  CreateVendorPayload,
  UpdateVendorPayload,
  DeleteVendorPayload
} from "../types";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Expenses", "Vendors"],
  endpoints: (builder) => ({
    fetchExpenses: builder.query<ExpensesResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/expenses`,
          method: "get",
        }),
      providesTags: ["Expenses"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setExpenses({
              expenses: response.data.data.expenses,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    fetchVendors: builder.query<VendorsResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/vendors`,
          method: "get",
        }),
      providesTags: ["Vendors"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setVendors({
              vendors: response.data.data.vendors,
            })
          );
        });
      },
    }),

    createExpense: builder.mutation<ExpensesResponse, CreateExpensePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/expenses`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Expenses"],
      transformErrorResponse: (error: any) => error.data,
    }),

    updateExpense: builder.mutation<ExpensesResponse, UpdateExpensePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/expenses/${formData.id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData,
        }),
      invalidatesTags: ["Expenses"],
      transformErrorResponse: (error: any) => error.data,
    }),

    deleteExpense: builder.mutation<ExpensesResponse, DeleteExpensePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/expenses/${formData.id}`,
          method: "delete",
          body: formData,
        }),
      invalidatesTags: ["Expenses"],
      transformErrorResponse: (error: any) => error.data,
    }),

    createVendor: builder.mutation<VendorsResponse, CreateVendorPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/vendors`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Vendors"],
      transformErrorResponse: (error: any) => error.data,
    }),

    updateVendor: builder.mutation<VendorsResponse, UpdateVendorPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/vendors/${formData.id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData,
        }),
      invalidatesTags: ["Vendors"],
      transformErrorResponse: (error: any) => error.data,
    }),

    deleteVendor: builder.mutation<VendorsResponse, DeleteVendorPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/vendors/${formData.id}`,
          method: "delete",
          body: formData,
        }),
      invalidatesTags: ["Vendors"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchExpensesQuery,
  useFetchVendorsQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = expenseApi;