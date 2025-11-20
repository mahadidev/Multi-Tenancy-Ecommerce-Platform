import { ApexChart } from '@seller/components';
import { useThemeMode } from 'flowbite-react';
import { FC } from 'react';

interface StockData {
	date: string;
	buyingValue: number;
	sellingValue: number;
	quantity: number;
	profit: number;
}

interface StockReportChartsProps {
	data: StockData[];
	timeRange: 'today' | 'week' | 'month' | 'year';
}

const StockReportCharts: FC<StockReportChartsProps> = ({ data }) => {
	const { mode } = useThemeMode();
	const isDarkTheme = mode === 'dark';

	// Enhanced color scheme with theme support
	const colors = {
		buying: isDarkTheme ? '#60A5FA' : '#3B82F6', // Blue
		selling: isDarkTheme ? '#34D399' : '#10B981', // Green
		quantity: isDarkTheme ? '#A78BFA' : '#8B5CF6', // Purple
		profit: isDarkTheme ? '#FBBF24' : '#F59E0B', // Amber
	};

	const labelColor = isDarkTheme ? '#D1D5DB' : '#6B7280';
	const gridColor = isDarkTheme ? '#374151' : '#F3F4F6';
	const backgroundColor = isDarkTheme ? '#1F2937' : '#FFFFFF';

	// Prepare chart data
	const categories = data.map(item => item.date);
	const buyingData = data.map(item => item.buyingValue);
	const sellingData = data.map(item => item.sellingValue);
	const quantityData = data.map(item => item.quantity);
	const profitData = data.map(item => item.profit);

	// Common chart options
	const commonOptions = {
		chart: {
			fontFamily: 'Inter, sans-serif',
			foreColor: labelColor,
			toolbar: { show: false },
			background: backgroundColor,
			animations: {
				enabled: true,
				speed: 800,
			}
		},
		grid: {
			show: true,
			borderColor: gridColor,
			strokeDashArray: 3,
		},
		xaxis: {
			categories,
			labels: {
				style: {
					colors: labelColor,
					fontSize: '12px',
					fontFamily: 'Inter, sans-serif',
				},
			},
		},
		tooltip: {
			theme: isDarkTheme ? 'dark' : 'light',
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
		},
		legend: {
			labels: {
				colors: labelColor,
			},
		}
	};

	// Bar Chart for Values
	const barChartOptions = {
		...commonOptions,
		chart: {
			...commonOptions.chart,
			type: 'bar',
			height: 350,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
				endingShape: 'rounded',
				borderRadius: 4,
			}
		},
		colors: [colors.buying, colors.selling],
		yaxis: {
			title: {
				text: 'Value (৳)',
				style: {
					color: labelColor,
					fontSize: '12px',
					fontFamily: 'Inter, sans-serif',
				}
			},
			labels: {
				style: {
					colors: labelColor,
					fontSize: '12px',
				},
				formatter: (val: number) => `৳${(val / 1000).toFixed(0)}k`
			}
		}
	};

	const barChartSeries = [
		{
			name: 'Buying Value',
			data: buyingData,
		},
		{
			name: 'Selling Value',
			data: sellingData,
		}
	];

	// Line Chart for Profit Trend
	const lineChartOptions = {
		...commonOptions,
		chart: {
			...commonOptions.chart,
			type: 'line',
			height: 300,
		},
		stroke: {
			curve: 'smooth',
			width: 3,
		},
		colors: [colors.profit],
		fill: {
			type: 'gradient',
			gradient: {
				shade: isDarkTheme ? 'dark' : 'light',
				type: 'vertical',
				shadeIntensity: 0.3,
				gradientToColors: [isDarkTheme ? '#92400E' : '#FEF3C7'],
				inverseColors: false,
				opacityFrom: 0.7,
				opacityTo: 0.1,
			}
		},
		markers: {
			size: 4,
			colors: [colors.profit],
			strokeColors: backgroundColor,
			strokeWidth: 2,
		},
		yaxis: {
			title: {
				text: 'Profit (৳)',
				style: {
					color: labelColor,
					fontSize: '12px',
					fontFamily: 'Inter, sans-serif',
				}
			},
			labels: {
				style: {
					colors: labelColor,
					fontSize: '12px',
				},
				formatter: (val: number) => `৳${(val / 1000).toFixed(0)}k`
			}
		}
	};

	const lineChartSeries = [
		{
			name: 'Profit',
			data: profitData,
		}
	];

	// Area Chart for Quantity
	const areaChartOptions = {
		...commonOptions,
		chart: {
			...commonOptions.chart,
			type: 'area',
			height: 280,
		},
		stroke: {
			curve: 'smooth',
			width: 2,
		},
		colors: [colors.quantity],
		fill: {
			type: 'gradient',
			gradient: {
				shade: isDarkTheme ? 'dark' : 'light',
				type: 'vertical',
				shadeIntensity: 0.3,
				gradientToColors: [isDarkTheme ? '#5B21B6' : '#EDE9FE'],
				inverseColors: false,
				opacityFrom: 0.7,
				opacityTo: 0.1,
			}
		},
		yaxis: {
			title: {
				text: 'Quantity',
				style: {
					color: labelColor,
					fontSize: '12px',
					fontFamily: 'Inter, sans-serif',
				}
			},
			labels: {
				style: {
					colors: labelColor,
					fontSize: '12px',
				},
				formatter: (val: number) => `${val}`
			}
		}
	};

	const areaChartSeries = [
		{
			name: 'Quantity',
			data: quantityData,
		}
	];

	if (data.length === 0) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12">
				<div className="text-center">
					<div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
						<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
						No chart data available
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						No data found for the selected time range.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Values Comparison Bar Chart */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Buying vs Selling Values
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						Comparison of buying and selling values over time
					</p>
				</div>
				<div className="p-6">
					<ApexChart
						height={350}
						options={barChartOptions}
						series={barChartSeries}
						type="bar"
					/>
				</div>
			</div>

			{/* Profit Trend Line Chart */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Profit Trend
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						Profit performance over the selected period
					</p>
				</div>
				<div className="p-6">
					<ApexChart
						height={300}
						options={lineChartOptions}
						series={lineChartSeries}
						type="area"
					/>
				</div>
			</div>

			{/* Quantity Area Chart */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Quantity Distribution
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						Stock quantity changes over time
					</p>
				</div>
				<div className="p-6">
					<ApexChart
						height={280}
						options={areaChartOptions}
						series={areaChartSeries}
						type="area"
					/>
				</div>
			</div>
		</div>
	);
};

export default StockReportCharts;
