import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
    DashboardAnalytics, 
    SalesChartDataType, 
    SalesMetricsDataType, 
    SalesTrendsDataType,
    TrendingProductsResponse
} from "../types";

export interface DashboardState {
    // Analytics
    analytics: DashboardAnalytics | null;
    
    // Sales Chart Data
    salesChart: SalesChartDataType | null;
    salesSummary: SalesMetricsDataType | null;
    salesTrends: SalesTrendsDataType | null;
    
    // Trending Products Data
    trendingProducts: TrendingProductsResponse | null;
}

const initialState: DashboardState = {
    // Analytics
    analytics: null,
    
    // Sales Chart Data
    salesChart: null,
    salesSummary: null,
    salesTrends: null,
    
    // Trending Products Data
    trendingProducts: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // ======================================
        // Analytics Actions
        // ======================================
        setDashboardAnalytics: (
            state,
            action: PayloadAction<{
                analytics: DashboardAnalytics;
            }>
        ) => {
            state.analytics = action.payload?.analytics;
        },

        clearDashboardAnalytics: (state) => {
            state.analytics = null;
        },

        // ======================================
        // Sales Chart Actions
        // ======================================
        setSalesChartData: (
            state,
            action: PayloadAction<{
                salesChart: SalesChartDataType;
            }>
        ) => {
            state.salesChart = action.payload.salesChart;
        },

        setSalesSummary: (
            state,
            action: PayloadAction<{
                salesSummary: SalesMetricsDataType;
            }>
        ) => {
            state.salesSummary = action.payload.salesSummary;
        },

        setSalesTrends: (
            state,
            action: PayloadAction<{
                salesTrends: SalesTrendsDataType;
            }>
        ) => {
            state.salesTrends = action.payload.salesTrends;
        },

        clearSalesChartData: (state) => {
            state.salesChart = null;
            state.salesSummary = null;
            state.salesTrends = null;
        },

        // ======================================
        // Trending Products Actions
        // ======================================
        setTrendingProducts: (
            state,
            action: PayloadAction<{
                trendingProducts: TrendingProductsResponse;
            }>
        ) => {
            state.trendingProducts = action.payload.trendingProducts;
        },

        appendTrendingProducts: (
            state,
            action: PayloadAction<{
                trendingProducts: TrendingProductsResponse;
            }>
        ) => {
            const newData = action.payload.trendingProducts;
            if (state.trendingProducts) {
                state.trendingProducts = {
                    ...newData,
                    products: [...state.trendingProducts.products, ...newData.products],
                };
            } else {
                state.trendingProducts = newData;
            }
        },

        clearTrendingProducts: (state) => {
            state.trendingProducts = null;
        },

        // ======================================
        // Global Actions
        // ======================================
        clearAllDashboardData: (state) => {
            state.analytics = null;
            state.salesChart = null;
            state.salesSummary = null;
            state.salesTrends = null;
            state.trendingProducts = null;
        },

        resetDashboard: () => initialState,
    },
});

export const { 
    // Analytics
    setDashboardAnalytics,
    clearDashboardAnalytics,
    
    // Sales Chart
    setSalesChartData, 
    setSalesSummary, 
    setSalesTrends, 
    clearSalesChartData,
    
    // Trending Products
    setTrendingProducts,
    appendTrendingProducts,
    clearTrendingProducts,
    
    // Global
    clearAllDashboardData,
    resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;