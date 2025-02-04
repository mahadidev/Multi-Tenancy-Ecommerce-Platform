/* eslint-disable @typescript-eslint/ban-ts-comment */
import Chart from "react-apexcharts";

interface AnalyticsChartProps {
    series: any[];
}

const OverviewChart: React.FC<AnalyticsChartProps> = ({ series }) => {
    const options = {
        chart: {
            width: 450,
            height: 450,
            type: "pie",
        },
        labels: ["Products", "Categories", "Orders", "Customers"],

        legend: {
            position: "bottom",
            horizontalAlign: "center",
        },
    };

    return (
        <Chart
            // @ts-ignore
            options={options!}
            series={series}
            type="pie"
            height={450}
        />
    );
};

export default OverviewChart;
