import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { baseQuery, createRequest } from "@seller/store/baseQueryWithReAuth";
import {
    DashboardAnalyticsResponse,
    FetchDashboardAnalyticsPayload,
    FetchSalesChartPayload,
    FetchSalesTrendsPayload,
    FetchTrendingProductsPayload,
    SalesChartApiResponse,
    SalesMetricsApiResponse,
    SalesTrendsApiResponse,
    TrendingProductsApiResponse
} from "../types";
import {
    setDashboardAnalytics,
    setSalesChartData,
    setSalesSummary,
    setSalesTrends,
    setTrendingProducts
} from "./dashboardSlice";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQuery,
    tagTypes: ["Dashboard", "Analytics", "SalesChart", "TrendingProducts"],
    endpoints: (builder) => ({
        // ======================================
        // Dashboard Analytics Endpoints
        // ======================================
        fetchDashboardAnalytics: builder.query<DashboardAnalyticsResponse, FetchDashboardAnalyticsPayload | void>({
            query: (formData: any = {}) => {
                const filter = formData.filter || 'month';
                const start_date = formData.start_date || '2024-01-01';
                const end_date = formData.end_date || '2025-02-02';

                return createRequest({
                    url: `${PREFIX}/analytics?filter=${filter}&start_date=${start_date}&end_date=${end_date}`,
                    method: "get",
                });
            },
            providesTags: ["Dashboard", "Analytics"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(
                        setDashboardAnalytics({
                            analytics: response?.data?.data,
                        })
                    );
                });
            },
        }),

        // ======================================
        // Sales Chart Endpoints
        // ======================================
        fetchSalesChart: builder.query<SalesChartApiResponse, FetchSalesChartPayload>({
            query: (formData) => {
                let url = `${PREFIX}/sales/chart?period=${formData.range || 'last7days'}`;
                if (formData.range === 'custom' && formData.start_date && formData.end_date) {
                    url += `&start_date=${formData.start_date}&end_date=${formData.end_date}`;
                }
                return createRequest({
                    url,
                    method: 'get',
                });
            },
            providesTags: ["Dashboard", "SalesChart"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setSalesChartData({
                        salesChart: response?.data?.data?.chart
                    }));
                });
            },
        }),

        fetchSalesSummary: builder.query<SalesMetricsApiResponse, FetchSalesChartPayload>({
            query: (formData) => {
                let url = `${PREFIX}/sales/metrics?period=${formData.range || 'last7days'}`;
                if (formData.range === 'custom' && formData.start_date && formData.end_date) {
                    url += `&start_date=${formData.start_date}&end_date=${formData.end_date}`;
                }
                return createRequest({
                    url,
                    method: 'get',
                });
            },
            providesTags: ["Dashboard", "SalesChart"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setSalesSummary({
                        salesSummary: response?.data?.data?.metrics
                    }));
                });
            },
        }),

        fetchSalesTrends: builder.query<SalesTrendsApiResponse, FetchSalesTrendsPayload>({
            query: (formData) => {
                let url = `${PREFIX}/sales/trends?period=${formData.range}&compare=${formData.compare || false}`;
                if (formData.range === 'custom' && formData.start_date && formData.end_date) {
                    url += `&start_date=${formData.start_date}&end_date=${formData.end_date}`;
                }
                return createRequest({
                    url,
                    method: 'get',
                });
            },
            providesTags: ["Dashboard", "SalesChart"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setSalesTrends({
                        salesTrends: response?.data?.data?.trends
                    }));
                });
            },
        }),

        fetchSalesAnalytics: builder.query<SalesChartApiResponse, FetchSalesChartPayload>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/analytics/sales?period=${formData.range || 'last7days'}`,
                    method: 'get',
                }),
            providesTags: ["Dashboard", "SalesChart"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // ======================================
        // Trending Products Endpoints
        // ======================================
        fetchTrendingProducts: builder.query<TrendingProductsApiResponse, FetchTrendingProductsPayload>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/analytics/trending-products`,
                    method: 'post',
                    body: {
                        filter_type: formData.filter_type,
                        time_range: formData.time_range,
                        limit: formData.limit || 8,
                        page: formData.page || 1,
                    },
                }),
            providesTags: ["Dashboard", "TrendingProducts"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setTrendingProducts({
                        trendingProducts: response?.data?.data
                    }));
                });
            },
        }),
    }),
});

export const {
    // Analytics
    useFetchDashboardAnalyticsQuery,

    // Sales Chart
    useFetchSalesChartQuery,
    useFetchSalesSummaryQuery,
    useFetchSalesTrendsQuery,
    useFetchSalesAnalyticsQuery,

    // Trending Products
    useFetchTrendingProductsQuery,
} = dashboardApi;
