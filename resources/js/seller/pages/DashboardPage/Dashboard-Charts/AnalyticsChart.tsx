import Chart from "react-apexcharts";
import { useThemeMode } from 'flowbite-react';

interface AnalyticsChartProps {
    series: { name: string; data: number[] }[];
    title?: string;
    subtitle?: string;
    height?: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
    series, 
    title = "Monthly Analytics", 
    subtitle = "Sales and order trends",
    height = 450 
}) => {
    const { mode } = useThemeMode();
    const isDarkTheme = mode === 'dark';

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            foreColor: isDarkTheme ? "#D1D5DB" : "#6B7280",
            height: height,
            fontFamily: 'Inter, sans-serif',
            toolbar: { 
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                }
            },
            background: isDarkTheme ? '#1F2937' : '#FFFFFF',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 8,
                borderRadiusApplication: "end",
                borderRadiusWhenStacked: "last",
                columnWidth: "60%",
                dataLabels: {
                    position: "top"
                }
            },
        },
        dataLabels: { 
            enabled: false 
        },
        stroke: { 
            show: true, 
            width: 2, 
            colors: ["transparent"] 
        },
        xaxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            axisBorder: {
                show: true,
                color: isDarkTheme ? '#374151' : '#E5E7EB'
            },
            axisTicks: {
                show: true,
                color: isDarkTheme ? '#374151' : '#E5E7EB'
            },
            labels: {
                style: {
                    colors: isDarkTheme ? '#D1D5DB' : '#6B7280',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500
                }
            }
        },
        yaxis: {
            title: { 
                text: "Order Count",
                style: {
                    color: isDarkTheme ? '#D1D5DB' : '#6B7280',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                }
            },
            labels: {
                style: {
                    colors: isDarkTheme ? '#D1D5DB' : '#6B7280',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500
                },
                formatter: (val) => Math.floor(val).toString()
            }
        },
        fill: { 
            opacity: 1,
            type: 'gradient',
            gradient: {
                shade: isDarkTheme ? 'dark' : 'light',
                type: 'vertical',
                shadeIntensity: 0.3,
                gradientToColors: undefined,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 0.8,
                stops: [0, 100]
            }
        },
        tooltip: {
            theme: isDarkTheme ? 'dark' : 'light',
            style: {
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
            },
            y: { 
                formatter: (val) => `${val} orders`,
                title: {
                    formatter: (seriesName) => seriesName + ":"
                }
            },
            marker: {
                show: true
            }
        },
        colors: [
            "#3B82F6", // Blue
            "#10B981", // Green  
            "#8B5CF6", // Purple
            "#F59E0B", // Yellow
            "#EF4444"  // Red
        ],
        grid: {
            show: true,
            borderColor: isDarkTheme ? '#374151' : '#F3F4F6',
            strokeDashArray: 3,
            position: 'back',
            xaxis: {
                lines: { show: false }
            },
            yaxis: {
                lines: { show: true }
            },
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'center',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            labels: {
                colors: isDarkTheme ? '#D1D5DB' : '#6B7280'
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                radius: 6
            },
            itemMargin: {
                horizontal: 15,
                vertical: 5
            }
        },
        title: {
            text: title,
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                fontSize: '18px',
                fontWeight: '600',
                fontFamily: 'Inter, sans-serif',
                color: isDarkTheme ? '#F9FAFB' : '#111827'
            }
        },
        subtitle: {
            text: subtitle,
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 30,
            floating: false,
            style: {
                fontSize: '14px',
                fontWeight: '400',
                fontFamily: 'Inter, sans-serif',
                color: isDarkTheme ? '#9CA3AF' : '#6B7280'
            }
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 350
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "80%"
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <Chart options={options} series={series} type="bar" height={height} />
        </div>
    );
};

export default AnalyticsChart;
