import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
    SalesChartDataType, 
    SalesMetricsDataType, 
    SalesTrendsDataType 
} from "../reducers/salesChartApi";

const initialState: {
    salesChart: SalesChartDataType | null;
    salesSummary: SalesMetricsDataType | null;
    salesTrends: SalesTrendsDataType | null;
} = {
    salesChart: null,
    salesSummary: null,
    salesTrends: null
};

const salesChartSlice = createSlice({
    name: 'salesChart',
    initialState,
    reducers: {
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
    },
});

export const { 
    setSalesChartData, 
    setSalesSummary, 
    setSalesTrends, 
    clearSalesChartData 
} = salesChartSlice.actions;

export default salesChartSlice.reducer;