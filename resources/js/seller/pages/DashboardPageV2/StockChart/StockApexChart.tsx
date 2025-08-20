import { ApexChart } from '@seller/components';
import { useThemeMode } from 'flowbite-react';
import { useMemo } from 'react';

interface StockApexChartProps {
	data: any;
	chartType: 'line' | 'bar' | 'area';
	timeRange: 'today' | 'week' | 'month' | 'year';
}

function StockApexChart({ data, chartType, timeRange }: StockApexChartProps) {
	const { mode } = useThemeMode();
	const isDarkTheme = mode === 'dark';

	// Process data with better error handling
	const chartData = useMemo(() => {
		const chartSeries = data?.chartSeries;
		if (!chartSeries) return { series: [], categories: [] };

		const categories = Object.keys(chartSeries);
		
		// Transform data for better visualization
		const buyingData = categories.map(category => 
			chartSeries[category]?.buyingValue || 0
		);
		
		const sellingData = categories.map(category => 
			chartSeries[category]?.sellingValue || 0
		);
		
		const quantityData = categories.map(category => 
			chartSeries[category]?.qty || 0
		);

		const series = [
			{
				name: 'Buying Value',
				data: buyingData,
				type: chartType
			},
			{
				name: 'Selling Value',
				data: sellingData,
				type: chartType
			},
			{
				name: 'Quantity',
				data: quantityData,
				type: chartType
			}
		];

		return { series, categories };
	}, [data, chartType]);

	// Enhanced color scheme with theme support
	const colors = {
		buying: isDarkTheme ? '#60A5FA' : '#3B82F6', // Blue
		selling: isDarkTheme ? '#34D399' : '#10B981', // Green
		quantity: isDarkTheme ? '#A78BFA' : '#8B5CF6', // Purple
	};

	const borderColor = isDarkTheme ? '#374151' : '#E5E7EB';
	const labelColor = isDarkTheme ? '#D1D5DB' : '#6B7280';
	const gridColor = isDarkTheme ? '#374151' : '#F3F4F6';
	const backgroundColor = isDarkTheme ? '#1F2937' : '#FFFFFF';

	const options: ApexCharts.ApexOptions = {
		chart: {
			type: chartType,
			height: 350,
			fontFamily: 'Inter, sans-serif',
			foreColor: labelColor,
			toolbar: {
				show: false,
			},
			background: backgroundColor,
			animations: {
				enabled: true,
				speed: 800,
			},
			zoom: {
				enabled: false
			}
		},
		stroke: {
			curve: 'smooth',
			width: chartType === 'bar' ? 0 : [3, 3, 2],
			colors: [colors.buying, colors.selling, colors.quantity]
		},
		fill: {
			type: chartType === 'area' ? ['gradient', 'gradient', 'solid'] : 'solid',
			gradient: chartType === 'area' ? {
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
			} : undefined
		},
		colors: [colors.buying, colors.selling, colors.quantity],
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
				endingShape: 'rounded',
				borderRadius: 4,
			}
		},
		dataLabels: {
			enabled: false,
		},
		markers: {
			size: 0, // No markers for bar chart
		},
		tooltip: {
			shared: true,
			intersect: false,
			theme: isDarkTheme ? 'dark' : 'light',
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
			y: [
				{
					title: {
						formatter: () => 'Buying: '
					},
					formatter: (val: number) => {
						if (val == null || val === undefined) return '৳0';
						return `৳${val.toLocaleString()}`;
					}
				},
				{
					title: {
						formatter: () => 'Selling: '
					},
					formatter: (val: number) => {
						if (val == null || val === undefined) return '৳0';
						return `৳${val.toLocaleString()}`;
					}
				},
				{
					title: {
						formatter: () => 'Quantity: '
					},
					formatter: (val: number) => {
						if (val == null || val === undefined) return '0 items';
						return `${val} items`;
					}
				}
			],
			custom: function({series, dataPointIndex, w}) {
				try {
					const category = w.globals.categoryLabels[dataPointIndex] || 'N/A';
					const buyingValue = series[0]?.[dataPointIndex] || 0;
					const sellingValue = series[1]?.[dataPointIndex] || 0;
					const quantityValue = series[2]?.[dataPointIndex] || 0;
					
					return `
						<div class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg">
							<div class="font-semibold text-gray-900 dark:text-white mb-2">${category}</div>
							<div class="space-y-1">
								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
										<span class="text-sm">Buying</span>
									</div>
									<span class="font-medium">৳${buyingValue.toLocaleString()}</span>
								</div>
								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
										<span class="text-sm">Selling</span>
									</div>
									<span class="font-medium">৳${sellingValue.toLocaleString()}</span>
								</div>
								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<div class="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
										<span class="text-sm">Quantity</span>
									</div>
									<span class="font-medium">${quantityValue} items</span>
								</div>
							</div>
						</div>
					`;
				} catch (error) {
					console.error('Tooltip error:', error);
					return `
						<div class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg">
							<div class="font-semibold text-gray-900 dark:text-white">Data unavailable</div>
						</div>
					`;
				}
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
			},
			axisTicks: {
				show: true,
				color: borderColor,
			},
			labels: {
				style: {
					colors: labelColor,
					fontSize: '12px',
					fontFamily: 'Inter, sans-serif',
					fontWeight: 500,
				},
				rotate: 0, // No rotation for bar chart
				maxHeight: 60
			},
			tooltip: {
				enabled: false
			}
		},
		yaxis: [
			{
				seriesName: 'Buying Value',
				title: {
					text: 'Value (৳)',
					style: {
						color: colors.buying,
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
				}
			},
			{
				seriesName: 'Selling Value',
				show: false
			},
			{
				opposite: true,
				seriesName: 'Quantity',
				title: {
					text: 'Quantity',
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
				}
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
				fillColors: [colors.buying, colors.selling, colors.quantity],
			},
			itemMargin: {
				horizontal: 8,
				vertical: 0
			},
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
						height: 300
					},
					legend: {
						position: 'top',
						horizontalAlign: 'center'
					}
				}
			},
			{
				breakpoint: 768,
				options: {
					chart: {
						height: 250
					},
					legend: {
						position: 'bottom',
						horizontalAlign: 'center',
						fontSize: '12px'
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

	// Loading and error states
	if (!data || !data.chartSeries) {
		return (
			<div className="flex items-center justify-center h-80">
				<div className="text-center">
					<div className="animate-pulse">
						<div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2"></div>
						<p className="text-sm text-gray-600 dark:text-gray-400">Loading chart data...</p>
					</div>
				</div>
			</div>
		);
	}

	if (chartData.categories.length === 0) {
		return (
			<div className="flex items-center justify-center h-80">
				<div className="text-center">
					<div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
						<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
						No data available
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						No stock data found for the selected time range.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<ApexChart
				height={350}
				options={options}
				series={chartData.series}
				type={chartType}
			/>
		</div>
	);
}

export default StockApexChart;
