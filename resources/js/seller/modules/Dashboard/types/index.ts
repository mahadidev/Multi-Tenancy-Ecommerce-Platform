// Dashboard Module Types
import { DashboardAnalytics } from "@type/analytics";
import { TopProductType } from "@type/orderType";
import { ApiResponseType } from "@type/apiType";

// ==============================================
// Analytics Types
// ==============================================

export interface DashboardAnalyticsResponse extends ApiResponseType {
    data: DashboardAnalytics;
}

// ==============================================
// Sales Chart Types
// ==============================================

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

// ==============================================
// Trending Products Types
// ==============================================

export interface TrendingProductsParams {
    filterType: 'top_selling' | 'most_revenue' | 'most_profitable' | 'recently_popular';
    timeRange: 'today' | 'last7days' | 'last30days' | 'last1year';
    limit?: number;
}

export interface TrendingProductsResponse {
    products: TopProductType[];
    total: number;
    period: string;
    filter_type: string;
    current_page: number;
    per_page: number;
    has_more: boolean;
    success: boolean;
    message?: string;
}

export interface TrendingProductsApiResponse extends ApiResponseType {
    data: TrendingProductsResponse;
}

// ==============================================
// Dashboard API Payloads
// ==============================================

export interface FetchDashboardAnalyticsPayload {
    filter?: 'day' | 'week' | 'month' | 'year';
    start_date?: string;
    end_date?: string;
}

export interface FetchSalesChartPayload {
    range?: 'today' | 'last7days' | 'last30days' | 'last1year' | 'custom';
    start_date?: string;
    end_date?: string;
}

export interface FetchSalesTrendsPayload {
    range: string;
    compare?: boolean;
    start_date?: string;
    end_date?: string;
}

export interface FetchTrendingProductsPayload {
    filter_type: 'top_selling' | 'most_revenue' | 'most_profitable' | 'recently_popular';
    time_range: 'today' | 'last7days' | 'last30days' | 'last1year';
    limit?: number;
    page?: number;
}

// ==============================================
// Dashboard Hook Types
// ==============================================

export interface UseDashboardParams {
    // Analytics options
    enableAnalytics?: boolean;
    
    // Sales chart options
    reportFilterRange?: 'today' | 'last7days' | 'last30days' | 'last1year' | 'custom';
    customDateRange?: { startDate: string; endDate: string };
    enableSalesSummary?: boolean;
    enableSalesTrends?: boolean;
    compareWithPrevious?: boolean;
    
    // Trending products options
    enableTrendingProducts?: boolean;
    trendingProductsParams?: TrendingProductsParams;
}

export interface UseDashboardReturn {
    // Analytics data
    analytics: DashboardAnalytics | null;
    isAnalyticsLoading: boolean;
    isAnalyticsError: boolean;
    analyticsError: any;
    
    // Sales chart data
    salesChart: SalesChartDataType | null;
    report: SalesChartDataType | null; // Backward compatibility
    salesSummary: SalesMetricsDataType | null;
    salesTrends: SalesTrendsDataType | null;
    
    // Sales loading states
    isSalesChartLoading: boolean;
    isSalesSummaryLoading: boolean;
    isSalesTrendsLoading: boolean;
    isSalesLoading: boolean;
    
    // Sales error states
    isSalesChartError: boolean;
    isSalesSummaryError: boolean;
    isSalesTrendsError: boolean;
    isSalesError: boolean;
    
    // Sales errors
    salesChartError: any;
    salesSummaryError: any;
    salesTrendsError: any;
    
    // Trending products data
    trendingProducts: TopProductType[];
    trendingProductsTotal: number;
    trendingProductsPeriod: string;
    isTrendingProductsLoading: boolean;
    isTrendingProductsError: boolean;
    trendingProductsError: string | null;
    hasNextPage: boolean;
    isTrendingProductsLoadingMore: boolean;
    
    // Utility functions
    refreshAllData: () => void;
    refreshAnalytics: () => void;
    refreshSalesData: () => void;
    refreshTrendingProducts: () => void;
    getSalesGrowthPercentage: () => number;
    getSalesTotals: () => { revenue: number; orders: number; profit: number };
    loadMoreTrendingProducts: () => void;
    
    // Refetch functions
    refetchAnalytics: () => void;
    refetchSalesChart: () => void;
    refetchSalesSummary: () => void;
    refetchSalesTrends: () => void;
}

// ==============================================
// Export re-exports from common types
// ==============================================

export type { DashboardAnalytics, TopProductType };