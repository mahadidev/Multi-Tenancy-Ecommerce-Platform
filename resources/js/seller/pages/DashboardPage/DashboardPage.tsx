import useDashboardAnalytics from "@seller/hooks/useDashboradAnalytics";
import { Card } from "flowbite-react";
import { FC } from "react";
import AnalyticsChart from "./Dashboard-Charts/AnalyticsChart";
import OverviewChart from "./Dashboard-Charts/OverViewChart";

const DashboardPage: FC = function () {
    const { analytics } = useDashboardAnalytics();

    //  orders analytics chart data
    const orderAnalyticsDataSeries: any[] = [
        { name: "Revenue", data: [50, 70, 65, 55, 80, 75, 60] },
        { name: "Orders", data: [30, 45, 60, 40, 55, 70, 50] },
    ];

    // real data comes from api
    // const orderAnalyticsDataSeries: any[] = [
    //     { name: "Revenue", data: analytics?.order_analytics?.monthly_revenues },
    //     { name: "Orders", data: analytics?.order_analytics?.orders },
    // ];

    // overview chart data analytics
    const overviewChartData: number[] = [
        analytics?.products_count || 0,
        analytics?.categories_count || 0,
        analytics?.orders_count || 6,
        analytics?.customers_count || 8,
    ];

    return (
        <div className="block border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    Dashboard Analytics
                </h1>
            </div>

            <div className="grid xl:grid-cols-2 gap-4">
                <Card className="rounded-lg dark:bg-[#2b384e] h-[580px]">
                    <p className="pl-5 pb-8 text-xl font-bold dark:text-white">
                        Order & Revenue
                    </p>

                    <AnalyticsChart series={orderAnalyticsDataSeries} />
                </Card>
                <div className="rounded-lg">
                    <Card className="rounded-lg dark:bg-[#2b384e] h-[580px]">
                        <p className="pl-5 text-xl pb-10 font-bold dark:text-white">
                            Acquisition Overview
                        </p>
                        <OverviewChart series={overviewChartData} />{" "}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
