import Chart from "react-apexcharts";

interface AnalyticsChartProps {
    series: { name: string; data: number[] }[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ series }) => {
    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            foreColor: "#6B7280",
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
                "May",
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
            title: { text: "Order Count" },
        },
        fill: { opacity: 1 },
        tooltip: {
            y: { formatter: (val) => `${val}` },
        },
        colors: ["#007bff", "#ff7f50"], // Blue and Orange
    };

    return <Chart options={options} series={series} type="bar" height={450} />;
};

export default AnalyticsChart;
