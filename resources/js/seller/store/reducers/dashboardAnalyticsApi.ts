import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { setDashboardAnalytics } from "../slices/dashboardAnalyticsSlice";

export interface DashboardAnalyticsType extends ApiResponseType {
    data: AnalyticsResponseData;
}

export interface AnalyticsResponseData {
	products_count: number;
	categories_count: number;
	orders_count: number;
	customers_count: number;
	order_analytics: OrderAnalytics;
	unique_visitor_count: number;
}

export interface OrderAnalytics {
    total_revenue: number;
    average_order_value: number;
    filter: string;
    orders: number[];
    monthly_revenues: number[];
}

export const dashboardAnalyticsApi = createApi({
    reducerPath: "dashboardAnalyticsApi",
    baseQuery: baseQuery,
    tagTypes: ["DashboardAnalytics"],
    endpoints: (builder) => ({
        // fetch dashboard analytics
        fetchDashboardAnalytics: builder.query<DashboardAnalyticsType, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/analytics?filter=month&start_date=2024-01-01&end_date=2025-02-02`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["DashboardAnalytics"],
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
    }),
});

export const { useFetchDashboardAnalyticsQuery } = dashboardAnalyticsApi;
