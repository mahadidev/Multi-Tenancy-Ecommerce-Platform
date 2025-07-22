import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardAnalytics } from "@type/analytics";

const initialState: {
    analytics: DashboardAnalytics | null;
} = {
    analytics: null,
};

const dashboardAnalyticsSlice = createSlice({
	name: 'dashboardAnalytics',
	initialState,
	reducers: {
		setDashboardAnalytics: (
			state,
			action: PayloadAction<{
				analytics: DashboardAnalytics;
			}>
		) => {
			state.analytics = action.payload?.analytics;
		},
	},
});
export const { setDashboardAnalytics } = dashboardAnalyticsSlice.actions;
export default dashboardAnalyticsSlice.reducer;
