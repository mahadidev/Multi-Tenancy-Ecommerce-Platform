import useToast from '@seller/_hooks/useToast';
import { useAppSelector } from '@seller/store/store';
import { useCallback, useMemo, useState } from 'react';
import {
    useFetchDashboardAnalyticsQuery,
    useFetchSalesChartQuery,
    useFetchSalesSummaryQuery,
    useFetchSalesTrendsQuery,
    useFetchTrendingProductsQuery,
} from '../store/dashboardApi';
import { UseDashboardParams, UseDashboardReturn } from '../types';

const useDashboard = (params: UseDashboardParams = {}): UseDashboardReturn => {
    const { toaster } = useToast();

    // Extract parameters with defaults
    const {
        enableAnalytics = true,
        reportFilterRange = 'last7days',
        customDateRange,
        enableSalesSummary = false,
        enableSalesTrends = false,
        compareWithPrevious = false,
        enableTrendingProducts = false,
        trendingProductsParams = {
            filterType: 'top_selling',
            timeRange: 'last7days',
            limit: 8
        }
    } = params;

    // ======================================
    // Trending Products State (for manual handling like original hook)
    // ======================================
    const [trendingProductsPage, setTrendingProductsPage] = useState(1);

    // ======================================
    // Dashboard Analytics Query
    // ======================================
    const {
        isLoading: isAnalyticsLoading,
        isError: isAnalyticsError,
        error: analyticsError,
        refetch: refetchAnalytics
    } = useFetchDashboardAnalyticsQuery(
        undefined,
        {
            skip: !enableAnalytics,
            refetchOnMountOrArgChange: true,
        }
    );

    // ======================================
    // Sales Chart Queries
    // ======================================
    const salesChartQueryParams = {
        range: reportFilterRange,
        start_date: reportFilterRange === 'custom' ? customDateRange?.startDate : undefined,
        end_date: reportFilterRange === 'custom' ? customDateRange?.endDate : undefined,
    };

    // Main sales chart data
    const {
        isLoading: isSalesChartLoading,
        isError: isSalesChartError,
        error: salesChartError,
        refetch: refetchSalesChart
    } = useFetchSalesChartQuery(
        salesChartQueryParams,
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            skip: false,
        }
    );

    // Sales summary (optional)
    const {
        isLoading: isSalesSummaryLoading,
        isError: isSalesSummaryError,
        error: salesSummaryError,
        refetch: refetchSalesSummary
    } = useFetchSalesSummaryQuery(
        salesChartQueryParams,
        {
            skip: !enableSalesSummary,
            refetchOnMountOrArgChange: true,
        }
    );

    // Sales trends (optional)
    const {
        isLoading: isSalesTrendsLoading,
        isError: isSalesTrendsError,
        error: salesTrendsError,
        refetch: refetchSalesTrends
    } = useFetchSalesTrendsQuery(
        {
            range: reportFilterRange,
            compare: compareWithPrevious,
            start_date: reportFilterRange === 'custom' ? customDateRange?.startDate : undefined,
            end_date: reportFilterRange === 'custom' ? customDateRange?.endDate : undefined,
        },
        {
            skip: !enableSalesTrends,
            refetchOnMountOrArgChange: true,
        }
    );

    // ======================================
    // Trending Products Query
    // ======================================
    const {
        isLoading: isTrendingProductsLoading,
        isError: isTrendingProductsError,
        error: trendingProductsError,
        refetch: refetchTrendingProducts
    } = useFetchTrendingProductsQuery(
        {
            filter_type: trendingProductsParams.filterType,
            time_range: trendingProductsParams.timeRange,
            limit: trendingProductsParams.limit || 8,
            page: trendingProductsPage,
        },
        {
            skip: !enableTrendingProducts,
            refetchOnMountOrArgChange: true,
        }
    );

    // ======================================
    // Select data from Redux store
    // ======================================
    const {
        analytics,
        salesChart,
        salesSummary,
        salesTrends,
        trendingProducts: trendingProductsStore
    } = useAppSelector((state) => state.dashboard);

    // ======================================
    // Utility Functions
    // ======================================

    const refreshAllData = useCallback(() => {
        if (enableAnalytics) refetchAnalytics();
        refetchSalesChart();
        if (enableSalesSummary) refetchSalesSummary();
        if (enableSalesTrends) refetchSalesTrends();
        if (enableTrendingProducts) refetchTrendingProducts();

        toaster({
            text: 'Dashboard data refreshed successfully',
            status: 'success',
        });
    }, [
        enableAnalytics, enableSalesSummary, enableSalesTrends, enableTrendingProducts,
        refetchAnalytics, refetchSalesChart, refetchSalesSummary,
        refetchSalesTrends, refetchTrendingProducts, toaster
    ]);

    const refreshAnalytics = useCallback(() => {
        if (enableAnalytics) {
            refetchAnalytics();
            toaster({
                text: 'Analytics data refreshed',
                status: 'success',
            });
        }
    }, [enableAnalytics, refetchAnalytics, toaster]);

    const refreshSalesData = useCallback(() => {
        refetchSalesChart();
        if (enableSalesSummary) refetchSalesSummary();
        if (enableSalesTrends) refetchSalesTrends();

        toaster({
            text: 'Sales data refreshed',
            status: 'success',
        });
    }, [
        enableSalesSummary, enableSalesTrends,
        refetchSalesChart, refetchSalesSummary, refetchSalesTrends, toaster
    ]);

    const refreshTrendingProducts = useCallback(() => {
        if (enableTrendingProducts) {
            setTrendingProductsPage(1);
            refetchTrendingProducts();
            toaster({
                text: 'Trending products refreshed',
                status: 'success',
            });
        }
    }, [enableTrendingProducts, refetchTrendingProducts, toaster]);

    const getSalesGrowthPercentage = useCallback(() => {
        if (!salesChart?.chartSeries) return 0;

        const values = Object.values(salesChart.chartSeries);
        if (values.length < 2) return 0;

        const current = values[values.length - 1]?.revenue || 0;
        const previous = values[values.length - 2]?.revenue || 0;

        if (previous === 0) return 0;
        return ((current - previous) / previous * 100);
    }, [salesChart]);

    const getSalesTotals = useCallback(() => {
        if (!salesChart?.chartSeries) return { revenue: 0, orders: 0, profit: 0 };

        const values = Object.values(salesChart.chartSeries);
        return values.reduce((acc, curr) => ({
            revenue: acc.revenue + (curr.revenue || 0),
            orders: acc.orders + (curr.product_qty || 0),
            profit: acc.profit + (curr.profit || 0)
        }), { revenue: 0, orders: 0, profit: 0 });
    }, [salesChart]);

    const loadMoreTrendingProducts = useCallback(() => {
        if (enableTrendingProducts && trendingProductsStore?.has_more && !isTrendingProductsLoading) {
            setTrendingProductsPage(prev => prev + 1);
        }
    }, [enableTrendingProducts, trendingProductsStore?.has_more, isTrendingProductsLoading]);

    // ======================================
    // Computed Loading States
    // ======================================
    const isSalesLoading = isSalesChartLoading ||
        (enableSalesSummary && isSalesSummaryLoading) ||
        (enableSalesTrends && isSalesTrendsLoading);

    const isSalesError = isSalesChartError ||
        (enableSalesSummary && isSalesSummaryError) ||
        (enableSalesTrends && isSalesTrendsError);

    // ======================================
    // Computed Values
    // ======================================
    const hasNextPage = useMemo(() => {
        return enableTrendingProducts &&
               trendingProductsStore?.has_more &&
               (trendingProductsStore?.products?.length || 0) < (trendingProductsStore?.total || 0);
    }, [enableTrendingProducts, trendingProductsStore]);

    // ======================================
    // Return Hook Interface
    // ======================================
    return {
        // Analytics data
        analytics: enableAnalytics ? analytics : null,
        isAnalyticsLoading: enableAnalytics ? isAnalyticsLoading : false,
        isAnalyticsError: enableAnalytics ? isAnalyticsError : false,
        analyticsError: enableAnalytics ? analyticsError : null,

        // Sales chart data
        salesChart,
        report: salesChart, // Backward compatibility alias
        salesSummary: enableSalesSummary ? salesSummary : null,
        salesTrends: enableSalesTrends ? salesTrends : null,

        // Sales loading states
        isSalesChartLoading,
        isSalesSummaryLoading: enableSalesSummary ? isSalesSummaryLoading : false,
        isSalesTrendsLoading: enableSalesTrends ? isSalesTrendsLoading : false,
        isSalesLoading,

        // Sales error states
        isSalesChartError,
        isSalesSummaryError: enableSalesSummary ? isSalesSummaryError : false,
        isSalesTrendsError: enableSalesTrends ? isSalesTrendsError : false,
        isSalesError,

        // Sales errors
        salesChartError,
        salesSummaryError: enableSalesSummary ? salesSummaryError : null,
        salesTrendsError: enableSalesTrends ? salesTrendsError : null,

        // Trending products data
        trendingProducts: enableTrendingProducts ? (trendingProductsStore?.products || []) : [],
        trendingProductsTotal: enableTrendingProducts ? (trendingProductsStore?.total || 0) : 0,
        trendingProductsPeriod: enableTrendingProducts ? (trendingProductsStore?.period || '') : '',
        isTrendingProductsLoading: enableTrendingProducts ? isTrendingProductsLoading : false,
        isTrendingProductsError: enableTrendingProducts ? isTrendingProductsError : false,
        trendingProductsError: enableTrendingProducts ?
            (trendingProductsError ? JSON.stringify(trendingProductsError) : null) : null,
        hasNextPage: hasNextPage || false,
        isTrendingProductsLoadingMore: enableTrendingProducts ?
            (isTrendingProductsLoading && trendingProductsPage > 1) : false,

        // Utility functions
        refreshAllData,
        refreshAnalytics,
        refreshSalesData,
        refreshTrendingProducts,
        getSalesGrowthPercentage,
        getSalesTotals,
        loadMoreTrendingProducts,

        // Refetch functions
        refetchAnalytics,
        refetchSalesChart,
        refetchSalesSummary,
        refetchSalesTrends,
    };
};

export default useDashboard;
