import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { setSalesChartData } from "../slices/salesChartSlice";

export interface SalesChartDataType {
	chartSeries: {
		[key: string]: {
			order_count: number;
			revenue: number;
			profit: number;
			product_qty: number;
			products?: Array<{
				name: string;
				price: number;
			}>;
		};
	};
	period: string;
	total_revenue: number;
	total_profit: number;
	total_orders: number;
	growth_percentage?: number;
}

// Separate interface for trends data
export interface SalesTrendsDataType {
	period: string;
	daily_trends: Array<{
		date: string;
		revenue: number;
		product_qty: number;
	}>;
	top_products: Array<{
		product_id: number;
		total_revenue: number;
		total_quantity: number;
		product: {
			id: number;
			name: string;
			thumbnail?: string;
		};
	}>;
	current_period: {
		revenue: number;
		orders: number;
		profit: number;
	};
	previous_period?: {
		period: string;
		revenue: number;
		orders: number;
		profit: number;
	};
	growth_comparison?: {
		revenue_growth: number;
		orders_growth: number;
		profit_growth: number;
	};
}

// Separate interface for metrics data
export interface SalesMetricsDataType {
	total_revenue: number;
	total_profit: number;
	total_orders: number;
	paid_revenue: number;
	pending_revenue: number;
	period: string;
	growth_percentage: number;
}

export interface SalesChartApiResponse extends ApiResponseType {
	data: {
		chart: SalesChartDataType;
	};
}

export interface SalesTrendsApiResponse extends ApiResponseType {
	data: {
		trends: SalesTrendsDataType;
	};
}

export interface SalesMetricsApiResponse extends ApiResponseType {
	data: {
		metrics: SalesMetricsDataType;
	};
}

export interface FetchSalesChartPayloadType {
	range?: 'today' | 'last7days' | 'last30days' | 'last1year';
}

export const salesChartApi = createApi({
	reducerPath: 'salesChartApi',
	baseQuery: baseQuery,
	tagTypes: ['SalesChart'],
	endpoints: (builder) => ({
		// fetch sales chart data - dedicated endpoint for charts only
		fetchSalesChart: builder.query<SalesChartApiResponse, FetchSalesChartPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/sales/chart?period=${formData.range}`,
					method: 'get',
				}),
			providesTags: ['SalesChart'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setSalesChartData({ 
						salesChart: response?.data?.data?.chart
					}));
				});
			},
		}),

		// fetch sales metrics summary - lightweight endpoint
		fetchSalesSummary: builder.query<SalesMetricsApiResponse, FetchSalesChartPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/sales/metrics?period=${formData.range}`,
					method: 'get',
				}),
			providesTags: ['SalesChart'],
			transformErrorResponse: (error: any) => error.data,
		}),

		// fetch sales trends for comparison
		fetchSalesTrends: builder.query<SalesTrendsApiResponse, { range: string; compare?: boolean }>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/sales/trends?period=${formData.range}&compare=${formData.compare || false}`,
					method: 'get',
				}),
			providesTags: ['SalesChart'],
			transformErrorResponse: (error: any) => error.data,
		}),

		// fetch sales analytics (minimal data for charts)
		fetchSalesAnalytics: builder.query<SalesChartApiResponse, FetchSalesChartPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/analytics/sales?period=${formData.range}`,
					method: 'get',
				}),
			providesTags: ['SalesChart'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const {
	useFetchSalesChartQuery,
	useFetchSalesSummaryQuery,
	useFetchSalesTrendsQuery,
	useFetchSalesAnalyticsQuery
} = salesChartApi;