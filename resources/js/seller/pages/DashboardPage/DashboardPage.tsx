import useDashboardAnalytics from "@seller/hooks/useDashboradAnalytics";
import React, { FC } from "react";
import { FaBox, FaList, FaShoppingCart, FaUsers } from "react-icons/fa";
import AnalyticsChart from "./AnalyticsChart";
import OverViewCard from "./OverViewCard";

const DashboardPage: FC = function () {
    const { analytics } = useDashboardAnalytics();

    //  orders analytics chart data
    const dataSeries: any[] = [
        { name: "Revenue", data: [50, 70, 65, 55, 80, 75, 60] },
        { name: "Orders", data: [30, 45, 60, 40, 55, 70, 50] },
    ];

    // real data comes from api
    // const dataSeries: any[] = [
    //     { name: "Revenue", data: analytics?.order_analytics?.monthly_revenues },
    //     { name: "Orders", data: analytics?.order_analytics?.orders },
    // ];

    // stats
    const stats: DashboardStatsType[] = [
        {
            title: "Products",
            value: analytics?.products_count || 0,
            icon: <FaBox className="text-blue-500 text-2xl" />,
        },
        {
            title: "Categories",
            value: analytics?.categories_count || 0,
            icon: <FaList className="text-green-500 text-2xl" />,
        },
        {
            title: "Orders",
            value: analytics?.orders_count || 0,
            icon: <FaShoppingCart className="text-yellow-500 text-2xl" />,
        },
        {
            title: "Customers",
            value: analytics?.customers_count || 0,
            icon: <FaUsers className="text-red-500 text-2xl" />,
        },
    ];
    return (
        <div className="block border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    Dashboard Analytics
                </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                {stats?.map((stat, idx) => (
                    <OverViewCard key={idx} stat={stat} />
                ))}
            </div>

            <div className="grid xl:grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#2b384e]">
                    <p className="pl-5 pt-5 text-xl font-bold text-white">
                        Order -{" "}
                        {analytics?.order_analytics?.average_order_value || 0}
                    </p>
                    <p className="pl-5 pt-2 text-xl font-bold text-white">
                        Revenue -{" "}
                        {analytics?.order_analytics?.total_revenue || 0} BDT
                    </p>

                    <AnalyticsChart series={dataSeries} />
                </div>
                <div className=" rounded-lg">
                    {/* <Chart
                        type="bar"
                        // @ts-ignore
                        options={state?.options!}
                        series={state?.series}
                        height={500}
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

export interface DashboardStatsType {
    title: string;
    value: number;
    icon: React.ReactElement;
}
