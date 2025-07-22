import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import baseQueryWithReAuth, { createRequest } from '../baseQueryWithReAuth';
import { setAllProductStockHistory, setProductStockHistory } from '../slices/productStockHistorySlice';


export interface FetchAllProductStockHistoryPayloadType {
    range?: "today" | 'week' | "month" | "year"
}

export interface FetchAllProductStockHistoryResponse extends ApiResponseType {
	data: {
		history: any[];
	};
}

export interface FetchProductStockHistoryPayloadType {
	productId: number | string;
}

export interface FetchProductStockHistoryResponse extends ApiResponseType {
	data: {
		history: any[];
	};
}


export const productStockHistoryApi = createApi({
	reducerPath: 'productStockHistoryApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Stocks', 'Stock'],
	endpoints: (builder) => ({
		// history
		fetchAllProductStockHistory: builder.query<
			FetchAllProductStockHistoryResponse,
			FetchAllProductStockHistoryPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/stock-history?range=${formData.range}`,
					method: 'get',
				}),
			providesTags: ['Stocks'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setAllProductStockHistory(response.data.data.history));
				});
			},
		}),
		// history
		fetchProductStockHistory: builder.query<
			FetchProductStockHistoryResponse,
			FetchProductStockHistoryPayloadType
		>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/products/${formData.productId}/stock-history`,
					method: 'get',
				}),
			providesTags: ['Stocks'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setProductStockHistory(response.data.data.history));
				});
			},
		}),
	}),
});

export const { useFetchAllProductStockHistoryQuery, useFetchProductStockHistoryQuery } = productStockHistoryApi;
