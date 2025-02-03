/* eslint-disable @typescript-eslint/ban-ts-comment */
import Chart from "react-apexcharts";

interface AnalyticsChartProps {
    series: any[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ series }) => {
    const options = {
        chart: {
            type: "bar",
            foreColor: "#ccc",
            height: 450,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 5,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
        },
        yaxis: {
            title: {
                text: "Order Count",
            },
        },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val: any) => `${val}` } },
        colors: ["#007bff", "#ff7f50"], // Blue and Orange
    };

    return (
        <Chart
            // @ts-ignore
            options={options!}
            series={series}
            type="bar"
            height={350}
        />
    );
};

export default AnalyticsChart;
