import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import { ProductStockHistoryType } from '@type/productType';
import baseQueryWithReAuth, { createRequest } from '../baseQueryWithReAuth';
import { setHistories } from '../slices/productStockHistorySlice';


export interface FetchHistoriesPayloadType {
	range?: 'today' | 'week' | 'month' | 'year' | 'custom';
	start_date?: string;
	end_date?: string;
	limit?: number;
	page?: number;
}

export interface FetchHistoriesResponseType extends ApiResponseType {
	data: {
		histories: ProductStockHistoryType[];
	};
}

export interface FetchSingleProductHistoryPayloadType {
    productId: number | string;
	range?: 'today' | 'week' | 'month' | 'year';
}
export interface FetchSingleProductHistoryResponseType extends ApiResponseType {
	data: {
		histories: ProductStockHistoryType[];
	};
}

export interface FetchHistoryPayloadType {
	historyId: number | string;
}
export interface FetchHistoryResponseType extends ApiResponseType {
	data: {
		history: ProductStockHistoryType;
	};
}


export const productStockHistoryApi = createApi({
	reducerPath: 'productStockHistoryApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Stocks', 'Stock'],
	endpoints: (builder) => ({
		// history
		fetchHistories: builder.query<
			FetchHistoriesResponseType,
			FetchHistoriesPayloadType
		>({
			query: (formData) => {
				let url = `${PREFIX}/products/stocks/history?range=${formData.range}`;
				if (formData.range === 'custom' && formData.start_date && formData.end_date) {
					url += `&start_date=${formData.start_date}&end_date=${formData.end_date}`;
				}
				// Add pagination and limit to prevent timeouts
				url += `&limit=${formData.limit || 10}&page=${formData.page || 1}`;
				return createRequest({
					url,
					method: 'get',
				});
			},
			providesTags: ['Stocks'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setHistories({
						histories: response.data.data.histories,
						meta: response.data.meta || null
					}));
				});
			},
		}),
	}),
});

export const { useFetchHistoriesQuery } = productStockHistoryApi;
