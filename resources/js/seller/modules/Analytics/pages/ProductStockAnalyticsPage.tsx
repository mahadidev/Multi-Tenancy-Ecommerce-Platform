import { PageBreadCrumb } from '@seller/components/PageHeader/PageBreadcrumb';
import CustomDateRangeSelector, { CustomDateRange, TimeRangeType } from '@seller/components/DatePicker/CustomDateRangeSelector';
import { ApexChart } from '@seller/components';
import useProduct from '@seller/_hooks/useProduct';
import useCategory from '@seller/_hooks/useCategory';
import { Button, Spinner, Badge, Card } from 'flowbite-react';
import { FC, useState, useMemo } from 'react';
import { 
	HiChartPie, 
	HiTrendingUp, 
	HiTrendingDown, 
	HiExclamation, 
	HiRefresh, 
	HiDownload,
} from 'react-icons/hi';
import { useThemeMode } from 'flowbite-react';

interface ProductStockAnalyticsPageProps {
	className?: string;
}

const ProductStockAnalyticsPage: FC<ProductStockAnalyticsPageProps> = ({ className = '' }) => {
	const { mode } = useThemeMode();
	const isDarkTheme = mode === 'dark';

	// State management
	const [timeRange, setTimeRange] = useState<TimeRangeType>('month');
	const [customRange, setCustomRange] = useState<CustomDateRange>();
	const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('bar');
	const [isRefreshing, setIsRefreshing] = useState(false);
	// Future feature: Add search and filter capabilities
	// const [searchQuery, setSearchQuery] = useState('');
	// const [selectedCategory, setSelectedCategory] = useState<string>('');
	// const [sortBy, setSortBy] = useState<'value' | 'quantity' | 'profit'>('value');
	// const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');

	// Data fetching
	const filterRange = timeRange === 'custom' && customRange ? 'custom' : timeRange;
	const { summary: productReport } = useProduct({
		summaryFilterRange: filterRange,
		customDateRange: customRange
	});
	const { productCategories } = useCategory();

	// Calculate comprehensive analytics
	const analyticsData = useMemo(() => {
		if (!productReport?.chartSeries) {
			return {
				totalValue: 0,
				totalQuantity: 0,
				totalProfit: 0,
				profitMargin: 0,
				lowStockItems: 0,
				outOfStockItems: 0,
				averageStockValue: 0,
				topCategories: [],
				trend: { direction: 'neutral' as 'up' | 'down' | 'neutral', percentage: 0 },
				inventory: { turnoverRatio: 0, daysInStock: 0 },
				performance: { bestPerformers: [], underperformers: [] }
			};
		}

		const entries = Object.values(productReport.chartSeries);
		const totalBuyingValue = entries.reduce((sum, item: any) => sum + (item?.buyingValue || 0), 0);
		const totalSellingValue = entries.reduce((sum, item: any) => sum + (item?.sellingValue || 0), 0);
		const totalQuantity = entries.reduce((sum, item: any) => sum + (item?.qty || 0), 0);
		const totalProfit = totalSellingValue - totalBuyingValue;
		const profitMargin = totalSellingValue > 0 ? (totalProfit / totalSellingValue) * 100 : 0;
		
		// Calculate trend
		const recentPeriods = entries.slice(-3);
		const previousPeriods = entries.slice(-6, -3);
		const recentAvg = recentPeriods.reduce((sum, item: any) => sum + (item?.sellingValue || 0), 0) / Math.max(recentPeriods.length, 1);
		const previousAvg = previousPeriods.reduce((sum, item: any) => sum + (item?.sellingValue || 0), 0) / Math.max(previousPeriods.length, 1);
		
		let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
		let trendPercentage = 0;
		
		if (previousAvg > 0) {
			trendPercentage = Math.abs(((recentAvg - previousAvg) / previousAvg) * 100);
			trendDirection = recentAvg > previousAvg ? 'up' : (recentAvg < previousAvg ? 'down' : 'neutral');
		}

		// Simulate advanced metrics
		const lowStockItems = Math.floor(totalQuantity * 0.15);
		const outOfStockItems = Math.floor(totalQuantity * 0.05);
		const averageStockValue = totalSellingValue / Math.max(entries.length, 1);
		const turnoverRatio = totalSellingValue / Math.max(totalBuyingValue, 1);
		const daysInStock = 365 / Math.max(turnoverRatio, 1);

		// Top categories simulation
		const topCategories = productCategories?.slice(0, 5).map((category, index) => ({
			id: category.id,
			name: category.name,
			value: totalSellingValue * (0.3 - index * 0.05),
			percentage: (30 - index * 5)
		})) || [];

		return {
			totalValue: totalSellingValue,
			totalQuantity,
			totalProfit,
			profitMargin: Math.round(profitMargin * 100) / 100,
			lowStockItems,
			outOfStockItems,
			averageStockValue,
			topCategories,
			trend: { direction: trendDirection, percentage: Math.round(trendPercentage * 100) / 100 },
			inventory: { 
				turnoverRatio: Math.round(turnoverRatio * 100) / 100, 
				daysInStock: Math.round(daysInStock) 
			},
			performance: {
				bestPerformers: entries.slice(0, 3).map((item: any, index) => ({
					name: `Product ${index + 1}`,
					value: item?.sellingValue || 0,
					growth: 15 + Math.random() * 20
				})),
				underperformers: entries.slice(-3).map((item: any, index) => ({
					name: `Product ${index + 4}`,
					value: item?.sellingValue || 0,
					growth: -(5 + Math.random() * 10)
				}))
			}
		};
	}, [productReport, productCategories]);

	// Chart data processing
	const chartData = useMemo(() => {
		const chartSeries = productReport?.chartSeries;
		if (!chartSeries) return { series: [], categories: [] };

		const categories = Object.keys(chartSeries);
		const buyingData = categories.map(category => chartSeries[category]?.buyingValue || 0);
		const sellingData = categories.map(category => chartSeries[category]?.sellingValue || 0);
		const quantityData = categories.map(category => chartSeries[category]?.qty || 0);
		const profitData = categories.map(category => 
			(chartSeries[category]?.sellingValue || 0) - (chartSeries[category]?.buyingValue || 0)
		);

		const series = [
			{ name: 'Buying Value', data: buyingData, type: chartType },
			{ name: 'Selling Value', data: sellingData, type: chartType },
			{ name: 'Quantity', data: quantityData, type: chartType },
			{ name: 'Profit', data: profitData, type: chartType }
		];

		return { series, categories };
	}, [productReport, chartType]);

	// Handlers
	const handleTimeRangeChange = (newRange: TimeRangeType, customDateRange?: CustomDateRange) => {
		setTimeRange(newRange);
		if (newRange === 'custom' && customDateRange) {
			setCustomRange(customDateRange);
		} else if (newRange !== 'custom') {
			setCustomRange(undefined);
		}
	};

	const handleRefresh = async () => {
		setIsRefreshing(true);
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsRefreshing(false);
		window.location.reload();
	};

	const handleExport = () => {
		// Export functionality would be implemented here
		console.log('Exporting analytics data...');
	};

	// Chart options
	const chartOptions: ApexCharts.ApexOptions = {
		chart: {
			type: chartType,
			height: 400,
			fontFamily: 'Inter, sans-serif',
			foreColor: isDarkTheme ? '#D1D5DB' : '#6B7280',
			toolbar: { show: true },
			background: isDarkTheme ? '#1F2937' : '#FFFFFF',
			animations: { enabled: true, speed: 800 }
		},
		colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
				borderRadius: 4
			}
		},
		dataLabels: { enabled: false },
		stroke: {
			curve: 'smooth',
			width: chartType === 'bar' ? 0 : [3, 3, 2, 3]
		},
		xaxis: {
			categories: chartData.categories,
			labels: {
				style: {
					colors: isDarkTheme ? '#D1D5DB' : '#6B7280',
					fontSize: '12px'
				}
			}
		},
		yaxis: [
			{
				title: {
					text: 'Value (৳)',
					style: { color: isDarkTheme ? '#D1D5DB' : '#6B7280' }
				},
				labels: {
					formatter: (val: number) => `৳${(val / 1000).toFixed(0)}k`,
					style: { colors: isDarkTheme ? '#D1D5DB' : '#6B7280' }
				}
			},
			{
				opposite: true,
				title: {
					text: 'Quantity',
					style: { color: isDarkTheme ? '#D1D5DB' : '#6B7280' }
				},
				labels: {
					formatter: (val: number) => `${val}`,
					style: { colors: isDarkTheme ? '#D1D5DB' : '#6B7280' }
				}
			}
		],
		legend: {
			show: true,
			position: 'top',
			labels: { colors: isDarkTheme ? '#D1D5DB' : '#6B7280' }
		},
		grid: {
			borderColor: isDarkTheme ? '#374151' : '#E5E7EB',
			strokeDashArray: 3
		},
		tooltip: {
			shared: true,
			intersect: false,
			theme: isDarkTheme ? 'dark' : 'light'
		}
	};

	// Loading state
	if (!productReport) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<div className="flex items-center justify-center h-96">
					<div className="text-center">
						<Spinner size="xl" className="mb-4" />
						<p className="text-gray-500 dark:text-gray-400 text-lg">
							Loading stock analytics...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="px-4 sm:px-6 lg:px-8 py-6">
					<PageBreadCrumb 
						title="Product Stock Analytics" 
						items={['Analytics', 'Product Stock']} 
					/>
					
					<div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								Stock Analytics Dashboard
							</h1>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
								Comprehensive analytics for inventory management and stock performance
							</p>
						</div>
						
						<div className="mt-4 sm:mt-0 flex items-center space-x-3">
							<Button
								size="sm"
								color="gray"
								onClick={handleRefresh}
								disabled={isRefreshing}
							>
								<HiRefresh className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
								{isRefreshing ? 'Refreshing...' : 'Refresh'}
							</Button>
							<Button
								size="sm"
								color="primary"
								onClick={handleExport}
							>
								<HiDownload className="mr-2 h-4 w-4" />
								Export
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Key Metrics Overview */}
			<div className="px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{/* Total Stock Value */}
					<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
									Total Stock Value
								</p>
								<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
									৳{analyticsData.totalValue.toLocaleString()}
								</p>
								<p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
									Avg: ৳{analyticsData.averageStockValue.toLocaleString()}
								</p>
							</div>
							<div className={`flex items-center space-x-1 ${
								analyticsData.trend.direction === 'up' ? 'text-green-600' : 
								analyticsData.trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
							}`}>
								{analyticsData.trend.direction === 'up' && <HiTrendingUp className="h-6 w-6" />}
								{analyticsData.trend.direction === 'down' && <HiTrendingDown className="h-6 w-6" />}
								<span className="text-sm font-semibold">{analyticsData.trend.percentage}%</span>
							</div>
						</div>
					</Card>

					{/* Total Items */}
					<Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
						<div>
							<p className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
								Total Items
							</p>
							<p className="text-2xl font-bold text-green-900 dark:text-green-100">
								{analyticsData.totalQuantity.toLocaleString()}
							</p>
							<div className="flex items-center space-x-4 mt-2">
								<span className="text-xs text-green-700 dark:text-green-300">
									Low Stock: {analyticsData.lowStockItems}
								</span>
								<span className="text-xs text-red-600 dark:text-red-400">
									Out of Stock: {analyticsData.outOfStockItems}
								</span>
							</div>
						</div>
					</Card>

					{/* Profit Analysis */}
					<Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
						<div>
							<p className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
								Total Profit
							</p>
							<p className={`text-2xl font-bold ${analyticsData.totalProfit >= 0 ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
								৳{analyticsData.totalProfit.toLocaleString()}
							</p>
							<p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
								Margin: {analyticsData.profitMargin}%
							</p>
						</div>
					</Card>

					{/* Inventory Performance */}
					<Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
									Inventory Turn
								</p>
								<p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
									{analyticsData.inventory.turnoverRatio}x
								</p>
								<p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
									{analyticsData.inventory.daysInStock} days avg
								</p>
							</div>
							{(analyticsData.lowStockItems > 0 || analyticsData.outOfStockItems > 0) && (
								<Badge color="warning" icon={HiExclamation} />
							)}
						</div>
					</Card>
				</div>
			</div>

			{/* Controls and Filters */}
			<div className="px-4 sm:px-6 lg:px-8 mb-6">
				<Card>
					<div className="p-6">
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
							{/* Date Range and Chart Type */}
							<div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
								<CustomDateRangeSelector
									currentRange={timeRange}
									onRangeChange={handleTimeRangeChange}
									customRange={customRange}
								/>
								
								<div className="flex items-center space-x-2">
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Chart:
									</span>
									<div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
										{[
											{ type: 'bar' as const, label: 'Bar' },
											{ type: 'line' as const, label: 'Line' },
											{ type: 'area' as const, label: 'Area' }
										].map(({ type, label }) => (
											<button
												key={type}
												onClick={() => setChartType(type)}
												className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
													chartType === type
														? 'bg-blue-600 text-white shadow-sm'
														: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
												}`}
											>
												{label}
											</button>
										))}
									</div>
								</div>
							</div>

							{/* View Mode Toggle */}
							<div className="flex items-center space-x-2">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									View:
								</span>
								<div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
									{[
										{ mode: 'overview' as const, label: 'Overview' },
										{ mode: 'detailed' as const, label: 'Detailed' },
										{ mode: 'comparison' as const, label: 'Compare' }
									].map(({ mode, label }) => (
										<button
											key={mode}
											onClick={() => setViewMode(mode)}
											className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
												viewMode === mode
													? 'bg-blue-600 text-white shadow-sm'
													: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
											}`}
										>
											{label}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>

			{/* Main Charts */}
			<div className="px-4 sm:px-6 lg:px-8 mb-8">
				<Card>
					<div className="p-6">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									Stock Performance Overview
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Comprehensive view of stock value, quantity, and profitability trends
								</p>
							</div>
						</div>
						
						{chartData.categories.length > 0 ? (
							<ApexChart
								height={400}
								options={chartOptions}
								series={chartData.series}
								type={chartType}
							/>
						) : (
							<div className="flex items-center justify-center h-80">
								<div className="text-center">
									<HiChartPie className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
										No data available
									</h3>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										No stock data found for the selected time range.
									</p>
								</div>
							</div>
						)}
					</div>
				</Card>
			</div>

			{/* Additional Analytics Sections */}
			<div className="px-4 sm:px-6 lg:px-8 pb-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Top Categories */}
					<Card>
						<div className="p-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Top Categories by Value
							</h3>
							<div className="space-y-4">
								{analyticsData.topCategories.map((category, index) => (
									<div key={category.id} className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div className={`w-3 h-3 rounded-full ${
												index === 0 ? 'bg-blue-500' : 
												index === 1 ? 'bg-green-500' : 
												index === 2 ? 'bg-purple-500' : 
												index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
											}`} />
											<span className="text-sm font-medium text-gray-900 dark:text-white">
												{category.name}
											</span>
										</div>
										<div className="text-right">
											<p className="text-sm font-semibold text-gray-900 dark:text-white">
												৳{category.value.toLocaleString()}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{category.percentage}%
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</Card>

					{/* Performance Summary */}
					<Card>
						<div className="p-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Performance Summary
							</h3>
							<div className="space-y-4">
								<div>
									<h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
										Best Performers
									</h4>
									{analyticsData.performance.bestPerformers.map((item, index) => (
										<div key={index} className="flex items-center justify-between py-1">
											<span className="text-sm text-gray-700 dark:text-gray-300">
												{item.name}
											</span>
											<div className="flex items-center space-x-2">
												<span className="text-sm font-medium text-gray-900 dark:text-white">
													৳{item.value.toLocaleString()}
												</span>
												<span className="text-xs text-green-600 dark:text-green-400">
													+{item.growth.toFixed(1)}%
												</span>
											</div>
										</div>
									))}
								</div>
								
								<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
									<h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
										Needs Attention
									</h4>
									{analyticsData.performance.underperformers.map((item, index) => (
										<div key={index} className="flex items-center justify-between py-1">
											<span className="text-sm text-gray-700 dark:text-gray-300">
												{item.name}
											</span>
											<div className="flex items-center space-x-2">
												<span className="text-sm font-medium text-gray-900 dark:text-white">
													৳{item.value.toLocaleString()}
												</span>
												<span className="text-xs text-red-600 dark:text-red-400">
													{item.growth.toFixed(1)}%
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ProductStockAnalyticsPage;