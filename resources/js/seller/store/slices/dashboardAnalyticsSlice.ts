import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnalyticsResponseData } from "../reducers/dashboardAnalyticsApi";

const initialState: {
    analytics: AnalyticsResponseData | null;
} = {
    analytics: null,
};

const dashboardAnalyticsSlice = createSlice({
    name: "dashboardAnalytics",
    initialState,
    reducers: {
        setDashboardAnalytics: (
            state,
            action: PayloadAction<{
                analytics: AnalyticsResponseData;
            }>
        ) => {
            state.analytics = action.payload?.analytics;
        },
    },
});
export const { setDashboardAnalytics } = dashboardAnalyticsSlice.actions;
export default dashboardAnalyticsSlice.reducer;
