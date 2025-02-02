import { useFetchDashboardAnalyticsQuery } from "@seller/store/reducers/dashboardAnalyticsApi";
import { useAppSelector } from "@seller/store/store";

const useDashboardAnalytics = () => {
    // fetch analytics
    useFetchDashboardAnalyticsQuery();

    // select analytics
    const { analytics } = useAppSelector((state) => state.analytics);

    return {
        analytics,
    };
};
export default useDashboardAnalytics;
