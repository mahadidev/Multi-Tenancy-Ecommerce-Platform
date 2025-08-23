import { ApexChart } from '@seller/components';
import { useDashboard } from '../../../hooks';
import { useThemeMode } from 'flowbite-react';
import { useMemo } from 'react';

interface SalesApexChartProps {
	range: 'today' | 'last7days' | 'last30days' | 'last1year';
}

function SalesApexChart({ range }: SalesApexChartProps) {
	const { report: salesReport } = useDashboard({ reportFilterRange: range });
	const { mode } = useThemeMode();
	const isDarkTheme = mode === 'dark';

	// Enhanced color scheme
	const colors = {
		revenue: isDarkTheme ? '#60A5FA' : '#3B82F6', // Blue
		profit: isDarkTheme ? '#34D399' : '#10B981',  // Green
		quantity: isDarkTheme ? '#A78BFA' : '#8B5CF6', // Purple
	};

	const borderColor = isDarkTheme ? '#374151' : '#E5E7EB';
	const labelColor = isDarkTheme ? '#D1D5DB' : '#6B7280';
	const gridColor = isDarkTheme ? '#374151' : '#F3F4F6';
	const backgroundColor = isDarkTheme ? '#1F2937' : '#FFFFFF';

	// Process data
	const chartData = useMemo(() => {
		const chartSeries = salesReport?.chartSeries;
		if (!chartSeries) return { series: [], categories: [] };

		const categories = Object.keys(chartSeries);

		const revenueData = categories.map(category =>
			chartSeries[category]?.revenue || 0
		);

		const profitData = categories.map(category =>
			chartSeries[category]?.profit || 0
		);

		const quantityData = categories.map(category =>
			chartSeries[category]?.product_qty || 0
		);

		const series = [
			{
				name: 'Revenue',
				data: revenueData,
				type: 'area'
			},
			{
				name: 'Profit',
				data: profitData,
				type: 'area'
			},
			{
				name: 'Orders',
				data: quantityData,
				type: 'line'
			}
		];

		return { series, categories };
	}, [salesReport]);

	const options: ApexCharts.ApexOptions = {
		chart: {
			type: 'line',
			height: 420,
			fontFamily: 'Inter, sans-serif',
			foreColor: labelColor,
			toolbar: {
				show: false,
			},
			background: backgroundColor,
			animations: {
				enabled: true,
				speed: 800,
				animateGradually: {
					enabled: true,
					delay: 150
				},
				dynamicAnimation: {
					enabled: true,
					speed: 350
				}
			},
			zoom: {
				enabled: true,
				type: 'x',
				autoScaleYaxis: true
			}
		},
		stroke: {
			curve: 'smooth',
			width: [0, 0, 3],
			colors: [colors.revenue, colors.profit, colors.quantity]
		},
		fill: {
			type: ['gradient', 'gradient', 'solid'],
			gradient: {
				shade: isDarkTheme ? 'dark' : 'light',
				type: 'vertical',
				shadeIntensity: 0.3,
				gradientToColors: [
					isDarkTheme ? '#1E40AF' : '#DBEAFE',
					isDarkTheme ? '#047857' : '#D1FAE5',
					colors.quantity
				],
				inverseColors: false,
				opacityFrom: 0.7,
				opacityTo: 0.1,
				stops: [0, 90, 100]
			}
		},
		colors: [colors.revenue, colors.profit, colors.quantity],
		dataLabels: {
			enabled: false,
		},
		markers: {
			size: [0, 0, 6],
			colors: [colors.revenue, colors.profit, colors.quantity],
			strokeColors: backgroundColor,
			strokeWidth: 2,
			strokeOpacity: 0.9,
			hover: {
				size: 8,
				sizeOffset: 3
			}
		},
		tooltip: {
			shared: true,
			intersect: false,
			theme: isDarkTheme ? 'dark' : 'light',
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
			x: {
				format: 'dd MMM yyyy'
			},
			y: [
				{
					title: {
						formatter: () => 'Revenue: '
					},
					formatter: (val: number) => `৳${val.toLocaleString()}`
				},
				{
					title: {
						formatter: () => 'Profit: '
					},
					formatter: (val: number) => `৳${val.toLocaleString()}`
				},
				{
					title: {
						formatter: () => 'Orders: '
					},
					formatter: (val: number) => `${val} items`
				}
			],
			marker: {
				show: true,
			},
			custom: function({series, dataPointIndex, w}) {
				const category = w.globals.categoryLabels[dataPointIndex];

				return `
					<div class="custom-tooltip bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
						<div class="font-semibold text-gray-900 dark:text-white mb-2">${category}</div>
						<div class="space-y-1">
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
									<span class="text-sm">Revenue</span>
								</div>
								<span class="font-medium">৳${series[0][dataPointIndex].toLocaleString()}</span>
							</div>
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
									<span class="text-sm">Profit</span>
								</div>
								<span class="font-medium">৳${series[1][dataPointIndex].toLocaleString()}</span>
							</div>
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<div class="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
									<span class="text-sm">Orders</span>
								</div>
								<span class="font-medium">${series[2][dataPointIndex]} items</span>
							</div>
						</div>
					</div>
				`;
			}
		},
		grid: {
			show: true,
			borderColor: gridColor,
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
				left: 10,
			},
		},
		xaxis: {
			categories: chartData.categories,
			axisBorder: {
				show: true,
				color: borderColor,
				offsetX: 0,
				offsetY: 0
			},
			axisTicks: {
				show: true,
				borderType: 'solid',
				color: borderColor,
				height: 6,
				offsetX: 0,
				offsetY: 0
			},
			labels: {
				style: {
					colors: labelColor,
					fontSize: '12px',
					fontFamily: 'Inter, sans-serif',
					fontWeight: 500,
				},
				offsetY: 5,
			},
			tooltip: {
				enabled: false
			}
		},
		yaxis: [
			{
				seriesName: 'Revenue',
				title: {
					text: 'Revenue (৳)',
					style: {
						color: colors.revenue,
						fontSize: '12px',
						fontFamily: 'Inter, sans-serif',
						fontWeight: 600,
					}
				},
				labels: {
					style: {
						colors: labelColor,
						fontSize: '12px',
						fontFamily: 'Inter, sans-serif',
						fontWeight: 500,
					},
					formatter: (val: number) => `৳${(val / 1000).toFixed(0)}k`
				},
				tickAmount: 6,
			},
			{
				seriesName: 'Revenue',
				show: false
			},
			{
				opposite: true,
				seriesName: 'Orders',
				title: {
					text: 'Orders',
					style: {
						color: colors.quantity,
						fontSize: '12px',
						fontFamily: 'Inter, sans-serif',
						fontWeight: 600,
					}
				},
				labels: {
					style: {
						colors: labelColor,
						fontSize: '12px',
						fontFamily: 'Inter, sans-serif',
						fontWeight: 500,
					},
					formatter: (val: number) => `${val}`
				},
				tickAmount: 6,
			}
		],
		legend: {
			show: true,
			position: 'top',
			horizontalAlign: 'center',
			fontSize: '14px',
			fontFamily: 'Inter, sans-serif',
			fontWeight: 500,
			labels: {
				colors: labelColor,
			},
			markers: {
				size: 12,
				strokeWidth: 0,
				fillColors: [colors.revenue, colors.profit, colors.quantity],
				offsetX: 0,
				offsetY: 0
			},
			itemMargin: {
				horizontal: 8,
				vertical: 0
			},
			floating: false,
			onItemClick: {
				toggleDataSeries: true
			},
			onItemHover: {
				highlightDataSeries: true
			}
		},
		responsive: [
			{
				breakpoint: 1024,
				options: {
					chart: {
						height: 350
					},
					legend: {
						position: 'top',
						horizontalAlign: 'center',
						itemMargin: {
							horizontal: 6,
							vertical: 0
						}
					}
				}
			},
			{
				breakpoint: 768,
				options: {
					chart: {
						height: 300
					},
					legend: {
						position: 'top',
						horizontalAlign: 'center',
						fontSize: '12px',
						itemMargin: {
							horizontal: 4,
							vertical: 0
						}
					},
					xaxis: {
						labels: {
							show: true,
							rotate: -45
						}
					},
					yaxis: [
						{
							title: {
								text: ''
							}
						},
						{
							show: false
						},
						{
							title: {
								text: ''
							}
						}
					]
				}
			}
		],
		states: {
			hover: {
				filter: {
					type: 'lighten'
				}
			},
			active: {
				allowMultipleDataPointsSelection: false,
				filter: {
					type: 'darken'
				}
			}
		}
	};

	return (
		<div className="relative">
			<ApexChart
				height={420}
				options={options}
				series={chartData.series}
				type="line"
			/>

			{/* Loading overlay */}
			{!salesReport && (
				<div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-lg">
					<div className="text-center">
						<div className="animate-pulse">
							<div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2"></div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Loading chart data...</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default SalesApexChart;
