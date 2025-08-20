import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller/seller_env';
import { ApiResponseType } from '@type/apiType';
import baseQueryWithReAuth, { createRequest } from '../baseQueryWithReAuth';
import { setProductStocksSummary } from '../slices/productStocksSlice';

export interface ProductStocksSummaryType {
	chartSeries: {
		[key: string]: {
			buyingValue: number;
			sellingValue: number;
			qty: number;
		};
	};
	totalBuyingValue: number;
	totalSellingValue: number;
	totalQty: number;
	period: string;
}

export interface FetchProductStocksSummaryPayloadType {
	range?: 'today' | 'week' | 'month' | 'year' | 'custom';
	start_date?: string;
	end_date?: string;
}

export interface FetchProductStocksSummaryResponseType extends ApiResponseType {
	data: {
		summary: ProductStocksSummaryType;
	};
}

export const productStocksApi = createApi({
	reducerPath: 'productStocksApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['ProductStocks'],
	endpoints: (builder) => ({
		// Fetch aggregated product stocks data for charts
		fetchProductStocksSummary: builder.query<
			FetchProductStocksSummaryResponseType,
			FetchProductStocksSummaryPayloadType
		>({
			query: (formData) => {
				let url = `${PREFIX}/products/stocks/summary?range=${formData.range}`;
				if (formData.range === 'custom' && formData.start_date && formData.end_date) {
					url += `&start_date=${formData.start_date}&end_date=${formData.end_date}`;
				}
				return createRequest({
					url,
					method: 'get',
				});
			},
			providesTags: ['ProductStocks'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setProductStocksSummary(response.data.data.summary));
				});
			},
		}),
	}),
});

export const {
	useFetchProductStocksSummaryQuery,
} = productStocksApi;