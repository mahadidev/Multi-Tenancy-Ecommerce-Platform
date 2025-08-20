import useProduct from '@seller/hooks/useProduct';
import { Button, Spinner } from 'flowbite-react';
import { FC, useMemo, useState } from 'react';
import { HiChartPie, HiEye, HiRefresh, HiTrendingDown, HiTrendingUp } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import CustomDateRangeSelector, { CustomDateRange, TimeRangeType } from '../../../components/DatePicker/CustomDateRangeSelector';
import StockApexChart from './StockApexChart';
import StockChartHeader from './components/StockChartHeader';
import StockMetrics from './components/StockMetrics';

interface StockChartProps {
	className?: string;
}

const StockChart: FC<StockChartProps> = ({ className = '' }) => {
	const [timeRange, setTimeRange] = useState<TimeRangeType>('month');
	const [customRange, setCustomRange] = useState<CustomDateRange>();
	const chartType = 'bar'; // Fixed chart type

	// Determine the filter range for API call
	const filterRange = timeRange === 'custom' && customRange ? 'custom' : timeRange;

	const { summary: productReport } = useProduct({
		summaryFilterRange: filterRange,
		customDateRange: customRange
	});

	// Calculate growth percentage based on chart data
	const growthData = useMemo(() => {
		if (!productReport?.chartSeries) {
			return { percentage: 0, isPositive: false };
		}

		const entries = Object.entries(productReport.chartSeries);
		if (entries.length < 2) {
			return { percentage: 0, isPositive: false };
		}

		// Compare current vs previous period
		const current = entries[entries.length - 1][1]?.qty || 0;
		const previous = entries[entries.length - 2][1]?.qty || 0;

		if (previous === 0) {
			return { percentage: current > 0 ? 100 : 0, isPositive: current > 0 };
		}

		const percentage = Math.round(((current - previous) / previous) * 100);
		return { percentage: Math.abs(percentage), isPositive: percentage >= 0 };
	}, [productReport]);

	const handleTimeRangeChange = (newRange: TimeRangeType, customDateRange?: CustomDateRange) => {
		setTimeRange(newRange);
		if (newRange === 'custom' && customDateRange) {
			setCustomRange(customDateRange);
		} else if (newRange !== 'custom') {
			setCustomRange(undefined);
		}
	};

	// Loading state
	if (!productReport) {
		return (
			<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}>
				<div className="flex items-center justify-center h-96">
					<div className="text-center">
						<Spinner size="xl" className="mb-4" />
						<p className="text-gray-500 dark:text-gray-400 text-sm">
							Loading stock analytics...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className} h-max`}>
			{/* Simple Header with Date Filter */}
			<div className="p-6 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-3">
						<HiChartPie className="h-5 w-5 text-blue-600 dark:text-blue-400" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stock Overview</h3>
					</div>
					<Link to="stock-report">
						<Button size="xs" color="gray" className="text-blue-600 dark:text-blue-400">
							<HiEye className="mr-1 h-3 w-3" />
							View Details
						</Button>
					</Link>
				</div>

				{/* Custom Date Filter */}
				<CustomDateRangeSelector
					currentRange={timeRange}
					onRangeChange={handleTimeRangeChange}
					customRange={customRange}
				/>
			</div>

			{/* Chart */}
			<div className="p-6">
				<StockApexChart
					data={productReport}
					chartType={chartType}
					timeRange={timeRange}
				/>
			</div>
		</div>
	);
}
export default StockChart
