import {
    useFetchSalesChartQuery,
    useFetchSalesSummaryQuery,
    useFetchSalesTrendsQuery,
    useFetchSalesAnalyticsQuery,
} from "@seller/store/reducers/salesChartApi";
import { PREFIX } from "@seller/seller_env";
import { useAppSelector } from "../store/store";
import useToast from "./useToast";

const useSalesChart = ({
    reportFilterRange,
    enableSummary = false,
    enableTrends = false,
    compareWithPrevious = false
}: {
    reportFilterRange?: 'today' | 'last7days' | 'last30days' | 'last1year' | undefined;
    enableSummary?: boolean;
    enableTrends?: boolean;
    compareWithPrevious?: boolean;
}) => {
    const { toaster } = useToast(); // for showing toast messages

    // Fetch sales chart data - calls /sales/chart (dedicated endpoint for charts only)
    const {
        data: salesChartData,
        isLoading: isSalesChartLoading,
        isError: isSalesChartError,
        error: salesChartError,
        refetch: refetchSalesChart
    } = useFetchSalesChartQuery(
        {
            range: reportFilterRange ?? 'last7days',
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            // Force refetch when range changes
            skip: false,
        }
    );

    // Debug logging to track API calls
    console.log(`🔥 Sales Chart API: Calling ${PREFIX}/sales/chart?period=${reportFilterRange ?? 'last7days'}`);
    console.log('📊 Sales Chart reportFilterRange:', reportFilterRange);
    if (salesChartData) {
        console.log('📊 Sales Chart Response:', salesChartData);
        console.log('📊 Chart Series Keys:', Object.keys(salesChartData?.data?.chart?.chartSeries || {}));
    }

    // Fetch sales summary (optional) - calls /sales/metrics (lightweight metrics only)
    const {
        data: salesSummaryData,
        isLoading: isSalesSummaryLoading,
        isError: isSalesSummaryError,
        error: salesSummaryError,
        refetch: refetchSalesSummary
    } = useFetchSalesSummaryQuery(
        {
            range: reportFilterRange ?? 'last7days',
        },
        {
            skip: !enableSummary,
            refetchOnMountOrArgChange: true,
        }
    );

    // Fetch sales trends (optional) - calls /sales/trends (comparison data only)
    const {
        data: salesTrendsData,
        isLoading: isSalesTrendsLoading,
        isError: isSalesTrendsError,
        error: salesTrendsError,
        refetch: refetchSalesTrends
    } = useFetchSalesTrendsQuery(
        {
            range: reportFilterRange ?? 'last7days',
            compare: compareWithPrevious
        },
        {
            skip: !enableTrends,
            refetchOnMountOrArgChange: true,
        }
    );

    // Select data from store
    const { salesChart, salesSummary, salesTrends } = useAppSelector(
        (state) => state.salesChart
    );

    // Utility functions
    const refreshAllData = () => {
        refetchSalesChart();
        if (enableSummary) refetchSalesSummary();
        if (enableTrends) refetchSalesTrends();
        
        toaster({
            text: 'Sales data refreshed successfully',
            status: 'success',
        });
    };

    const getGrowthPercentage = () => {
        if (!salesChart?.chartSeries) return 0;
        
        const values = Object.values(salesChart.chartSeries);
        if (values.length < 2) return 0;
        
        const current = values[values.length - 1]?.revenue || 0;
        const previous = values[values.length - 2]?.revenue || 0;
        
        if (previous === 0) return 0;
        return ((current - previous) / previous * 100);
    };

    const getTotals = () => {
        if (!salesChart?.chartSeries) return { revenue: 0, orders: 0, profit: 0 };
        
        const values = Object.values(salesChart.chartSeries);
        return values.reduce((acc, curr) => ({
            revenue: acc.revenue + (curr.revenue || 0),
            orders: acc.orders + (curr.product_qty || 0),
            profit: acc.profit + (curr.profit || 0)
        }), { revenue: 0, orders: 0, profit: 0 });
    };

    // Loading states
    const isLoading = isSalesChartLoading || 
        (enableSummary && isSalesSummaryLoading) || 
        (enableTrends && isSalesTrendsLoading);

    const isError = isSalesChartError || 
        (enableSummary && isSalesSummaryError) || 
        (enableTrends && isSalesTrendsError);

    // Return from hook
    return {
        // Main sales chart data
        salesChart,
        report: salesChart, // Backward compatibility alias
        
        // Optional data
        salesSummary: enableSummary ? salesSummary : null,
        salesTrends: enableTrends ? salesTrends : null,
        
        // Loading states
        isLoading,
        isSalesChartLoading,
        isSalesSummaryLoading,
        isSalesTrendsLoading,
        
        // Error states
        isError,
        isSalesChartError,
        isSalesSummaryError,
        isSalesTrendsError,
        
        // Errors
        salesChartError,
        salesSummaryError,
        salesTrendsError,
        
        // Utility functions
        refreshAllData,
        getGrowthPercentage,
        getTotals,
        
        // Refetch functions
        refetchSalesChart,
        refetchSalesSummary,
        refetchSalesTrends,
        
        // Raw API responses (for advanced usage)
        salesChartData,
        salesSummaryData,
        salesTrendsData,
    };
};

export default useSalesChart;