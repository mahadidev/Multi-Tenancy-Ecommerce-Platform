import useProduct from '@seller/_hooks/useProduct';
import { Button, Spinner } from 'flowbite-react';
import { FC, useState } from 'react';
import { HiChartPie, HiEye } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import CustomDateRangeSelector, { CustomDateRange, TimeRangeType } from '@seller/components/DatePicker/CustomDateRangeSelector';
import StockApexChart from './StockApexChart';

interface StockChartProps {
	className?: string;
}

const StockChart: FC<StockChartProps> = ({ className = '' }) => {
	const [timeRange, setTimeRange] = useState<TimeRangeType>('month');
	const [customRange, setCustomRange] = useState<CustomDateRange>();

	// Determine the filter range for API call
	const filterRange = timeRange === 'custom' && customRange ? 'custom' : timeRange;

	const { summary: productReport } = useProduct({
		summaryFilterRange: filterRange,
		customDateRange: customRange
	});

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
				<div className="flex items-center justify-center h-48">
					<div className="text-center">
						<Spinner size="lg" className="mb-3" />
						<p className="text-gray-500 dark:text-gray-400 text-sm">
							Loading stock data...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}>
			{/* Minimal Header */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<HiChartPie className="h-4 w-4 text-blue-600 dark:text-blue-400" />
						<h3 className="text-base font-medium text-gray-900 dark:text-white">Stock Overview</h3>
					</div>
					
					<Link to="/analytics/product-stock">
						<Button size="xs" color="blue">
							<HiEye className="mr-1 h-3 w-3" />
							View Details
						</Button>
					</Link>
				</div>
			</div>

			{/* Date Filter */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<CustomDateRangeSelector
					currentRange={timeRange}
					onRangeChange={handleTimeRangeChange}
					customRange={customRange}
				/>
			</div>

			{/* Simple Chart */}
			<div className="p-4">
				<StockApexChart
					data={productReport}
					chartType="bar"
					timeRange={timeRange}
				/>
			</div>
		</div>
	);
};

export default StockChart;