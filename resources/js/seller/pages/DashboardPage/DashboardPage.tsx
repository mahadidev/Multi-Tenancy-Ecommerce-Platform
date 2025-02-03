import useDashboardAnalytics from "@seller/hooks/useDashboradAnalytics";
import { Card } from "flowbite-react";
import React, { FC } from "react";
import { FaBox, FaList, FaShoppingCart, FaUsers } from "react-icons/fa";
const Chart = React.lazy(() => import("react-apexcharts"));

const DashboardPage: FC = function () {
    const { analytics } = useDashboardAnalytics();

    const [state] = React.useState({
        series: [
            {
                name: "Orders",
                // data: analytics?.order_analytics?.orders,
                data: [2233, 2122, 3424, 3435, 2332],
            },
            {
                name: "Revenue",
                // data: analytics?.order_analytics?.monthly_revenues,
                data: [2232, 1542, 3324, 3245, 2332],
            },
        ],
        options: {
            labels: ["Order Analytics"],
            chart: {
                type: "bar",
                height: 350,
                foreColor: "#ccc",
                toolbar: {
                    show: true,
                },
                dropShadow: {
                    enabled: true,
                    top: 2,
                    // left: 1,
                    blur: 4,
                    opacity: 1,
                },
            },
            dataLabels: {
                enabled: false,
            },

            colors: ["#7048E8", "#00E396", "#FEB019"],
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },

            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May"],
            },
            yaxis: {
                title: {
                    text: "Order Count",
                },
            },

            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val: any) {
                        return val;
                    },
                },
            },
        },
    });

    const stats = [
        {
            id: 1,
            title: "Products",
            value: analytics?.products_count,
            icon: <FaBox className="text-blue-500 text-3xl" />,
        },
        {
            id: 2,
            title: "Categories",
            value: analytics?.categories_count,
            icon: <FaList className="text-green-500 text-3xl" />,
        },
        {
            id: 3,
            title: "Orders",
            value: analytics?.orders_count,
            icon: <FaShoppingCart className="text-yellow-500 text-3xl" />,
        },
        {
            id: 4,
            title: "Customers",
            value: analytics?.customers_count,
            icon: <FaUsers className="text-red-500 text-3xl" />,
        },
    ];
    return (
        <div className="block border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    Dashboard Analytics
                </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <Card
                        key={stat.id}
                        className="p-6 shadow-2xl rounded-3xl hover:shadow-2xl transition-transform transform hover:scale-105 bg-gradient-to-r from-gray-50 to-gray-100"
                    >
                        <div className="flex items-center space-x-6">
                            {stat.icon}
                            <div>
                                <p className="text-gray-600 text-lg font-medium">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg">
                    <h2 className="pl-5 pt-5 text-xl font-bold text-white">
                        Order Analytics
                    </h2>
                    <Chart
                        type="bar"
                        // @ts-ignore
                        options={state?.options!}
                        series={state?.series}
                        height={500}
                    />
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
// const options = {
//     chart: {
//         foreColor: "#ccc",
//         toolbar: {
//             show: false,
//         },
//         dropShadow: {
//             enabled: true,
//             top: 2,
//             // left: 1,
//             blur: 4,
//             opacity: 1,
//         },

//         type: "radialBar",
//         height: 300,
//         // width: 320,
//     },
//     colors: ["#7048E8", "#00E396", "#FEB019"],

//     plotOptions: {
//         radialBar: {
//             size: undefined,
//             inverseOrder: true,
//             hollow: {
//                 margin: 5,
//                 size: "48%",
//                 background: "transparent",
//             },
//             track: {
//                 show: false,
//             },
//             startAngle: -180,
//             endAngle: 180,
//         },
//     },
//     stroke: {
//         lineCap: "round",
//     },
//     series: [
//         transactions?.newFlights,
//         transactions?.newBookings === 0 ? 10 : transactions?.newBookings,
//         transactions?.newAppointments,
//     ],
//     labels: ["Hotel", "Flight", "Package"],
//     legend: {
//         show: true,
//         floating: true,
//         position: "top",
//         // offsetX: 70,
//         offsetY: 200,
//     },
// };
