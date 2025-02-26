import useDashboardAnalytics from "@seller/hooks/useDashboradAnalytics";
import { FC } from "react";
import AnalyticsChart from "./Dashboard-Charts/AnalyticsChart";
import OverviewChart from "./Dashboard-Charts/OverViewChart";
import { StatCard } from "./Dashboard-Charts/StatCard";

const DashboardPage: FC = () => {
    const { analytics } = useDashboardAnalytics();

    const orderAnalyticsDataSeries = [
        {
            name: "Revenue",
            data: analytics?.order_analytics?.monthly_revenues ?? [],
        },
        { name: "Orders", data: analytics?.order_analytics?.orders ?? [] },
    ];

    const overviewChartData = [
        analytics?.products_count || 0,
        analytics?.categories_count || 0,
        analytics?.orders_count || 6,
        analytics?.customers_count || 8,
    ];

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard
                    title="2,340"
                    tagline="New products this week"
                    percentage="14.6%"
                    className="xl:col-span-2 h-[580px]"
                >
                    <AnalyticsChart series={orderAnalyticsDataSeries} />
                </StatCard>

                <StatCard
                    title="Customers Activity"
                    tagline="Order report of customers"
                    percentage="14.6%"
                >
                    <OverviewChart series={overviewChartData} />
                </StatCard>
            </div>
        </div>
    );
};

export default DashboardPage;
