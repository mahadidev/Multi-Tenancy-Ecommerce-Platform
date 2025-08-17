import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { ExpenseType } from "@type/expenseType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setTableExpenses } from "../slices/expenseSlice";

export interface ExpensesFetchResponse extends ApiResponseType {
    data: {
        expenses: ExpenseType[];
    };
}

export interface CreateExpensePayloadType {
    title: string;
    description?: string;
    amount: number;
    category: string;
    payment_method: string;
    vendor_id?: number;
    receipt_number?: string;
    expense_date: string;
    status?: 'pending' | 'approved' | 'rejected';
    notes?: string;
    attachments?: File[];
}

export interface UpdateExpensePayloadType {
    id: number;
    title?: string;
    description?: string;
    amount?: number;
    category?: string;
    payment_method?: string;
    vendor_id?: number;
    receipt_number?: string;
    expense_date?: string;
    status?: 'pending' | 'approved' | 'rejected';
    notes?: string;
    attachments?: File[];
}

export interface DeleteExpensePayloadType {
    id: number;
}

export const expenseApi = createApi({
    reducerPath: "expenseApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Expenses"],
    endpoints: (builder) => ({
        fetchExpenses: builder.query<ExpensesFetchResponse, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/expenses`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Expenses"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setTableExpenses({
                            expenses: response.data.data.expenses,
                            meta: response.data.meta ?? null,
                        })
                    );
                });
            },
        }),
        createExpense: builder.mutation<ApiResponseType, CreateExpensePayloadType>({
            query: (formData) => {
                const body = new FormData();

                // Add regular fields
                Object.keys(formData).forEach(key => {
                    if (key !== 'attachments' && formData[key as keyof CreateExpensePayloadType] !== undefined) {
                        body.append(key, String(formData[key as keyof CreateExpensePayloadType]));
                    }
                });

                // Add file attachments
                if (formData.attachments && formData.attachments.length > 0) {
                    formData.attachments.forEach((file, index) => {
                        body.append(`attachments[${index}]`, file);
                    });
                }

                return createRequest({
                    url: `${PREFIX}/expenses`,
                    method: "post",
                    body,
                });
            },
            invalidatesTags: ["Expenses"],
            transformErrorResponse: (error: any) => error.data,
        }),
        updateExpense: builder.mutation<ApiResponseType, UpdateExpensePayloadType>({
            query: (formData) => {
                const { id, ...data } = formData;
                const body = new FormData();

                // Add regular fields
                Object.keys(data).forEach(key => {
                    if (key !== 'attachments' && data[key as keyof Omit<UpdateExpensePayloadType, 'id'>] !== undefined) {
                        body.append(key, String(data[key as keyof Omit<UpdateExpensePayloadType, 'id'>]));
                    }
                });

                // Add file attachments
                if (data.attachments && data.attachments.length > 0) {
                    data.attachments.forEach((file, index) => {
                        body.append(`attachments[${index}]`, file);
                    });
                }

                return createRequest({
                    url: `${PREFIX}/expenses/${id}`,
                    method: "post",
                    apiMethod: "PUT",
                    body,
                });
            },
            invalidatesTags: ["Expenses"],
            transformErrorResponse: (error: any) => error.data,
        }),
        deleteExpense: builder.mutation<ApiResponseType, DeleteExpensePayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/expenses/${formData.id}`,
                    method: "post",
                    apiMethod: "delete",
                    body: formData,
                }),
            invalidatesTags: ["Expenses"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
} = expenseApi;
