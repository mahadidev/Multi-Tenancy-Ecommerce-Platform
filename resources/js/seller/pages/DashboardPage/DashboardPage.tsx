import useDashboardAnalytics from "@seller/hooks/useDashboradAnalytics";
import { Card } from "flowbite-react";
import { FC } from "react";
import AnalyticsChart from "./Dashboard-Charts/AnalyticsChart";
import OverviewChart from "./Dashboard-Charts/OverViewChart";

const DashboardPage: FC = function () {
    const { analytics } = useDashboardAnalytics();

    //  orders analytics chart data
    // const orderAnalyticsDataSeries: any[] = [
    //     { name: "Revenue", data: [50, 70, 65, 55, 80, 75, 60] },
    //     { name: "Orders", data: [30, 45, 60, 40, 55, 70, 50] },
    // ];

    // real data comes from api
    const orderAnalyticsDataSeries: any[] = [
        { name: "Revenue", data: analytics?.order_analytics?.monthly_revenues },
        { name: "Orders", data: analytics?.order_analytics?.orders },
    ];

    // overview chart data analytics
    const overviewChartData: number[] = [
        analytics?.products_count || 0,
        analytics?.categories_count || 0,
        analytics?.orders_count || 6,
        analytics?.customers_count || 8,
    ];

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <Card className="xl:col-span-2 rounded-lg dark:bg-gray-800 h-[580px]">
                    <div className="flex items-center mb-4">
                        <div className="shrink-0">
                            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                                2,340
                            </span>
                            <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
                                New products this week
                            </h3>
                        </div>
                        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-500 dark:text-green-400">
                            14.6%
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <AnalyticsChart series={orderAnalyticsDataSeries} />
                </Card>

                <Card className="rounded-lg dark:bg-gray-800 h-[580px]">
                    <div className="flex items-center mb-4">
                        <div className="shrink-0">
                            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                                Customers Activity
                            </span>
                            <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
                                Order report of customers
                            </h3>
                        </div>
                        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-500 dark:text-green-400">
                            14.6%
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <OverviewChart series={overviewChartData} />{" "}
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
