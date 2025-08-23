import { useDashboard } from '../../../hooks';
import { Button, Spinner } from 'flowbite-react';
import { useMemo, useState } from 'react';
import { HiChartBar, HiExclamationCircle, HiRefresh } from 'react-icons/hi';
import { FilterTabs, ProductTable, TimeRangeSelect, TrendingProductCard } from './components';
import {
    TimeRangeOption,
    TimeRangeType,
    TrendingProductsFilterOption,
    TrendingProductsFilterType,
} from './types';
import CustomDateModal, { CustomDateRange } from '@seller/components/DatePicker/CustomDateModal';

interface TrendingProductsProps {
	className?: string;
}

const TrendingProducts: React.FC<TrendingProductsProps> = ({ className = "" }) => {
	const filterOptions: TrendingProductsFilterOption[] = useMemo(
		() => [
			{ label: 'Top Selling', value: 'top_selling' },
			{ label: 'Revenue', value: 'most_revenue' },
			{ label: 'Profitable', value: 'most_profitable' },
			{ label: 'Popular', value: 'recently_popular' },
		],
		[]
	);

	const timeRangeOptions: TimeRangeOption[] = useMemo(
		() => [
			{ label: 'Today', value: 'today' },
			{ label: '7 Days', value: 'last7days' },
			{ label: '30 Days', value: 'last30days' },
			{ label: '1 Year', value: 'last1year' },
			{ label: 'Custom', value: 'custom' },
		],
		[]
	);

	const [currentFilter, setCurrentFilter] =
		useState<TrendingProductsFilterType>('top_selling');
	const [currentTimeRange, setCurrentTimeRange] =
		useState<TimeRangeType>('last7days');
	const [customRange, setCustomRange] = useState<CustomDateRange>();
	const [showCustomModal, setShowCustomModal] = useState(false);

	const { 
		trendingProducts: products, 
		isTrendingProductsLoading: isLoading, 
		isTrendingProductsError: isError, 
		trendingProductsError: error, 
		refreshTrendingProducts: refetch 
	} = useDashboard({
		enableTrendingProducts: true,
		trendingProductsParams: {
			filterType: currentFilter,
			timeRange: currentTimeRange,
			limit: 10
		}
	});

	const handleFilterChange = (newFilter: TrendingProductsFilterType) => {
		setCurrentFilter(newFilter);
	};

	const handleTimeRangeChange = (newTimeRange: TimeRangeType) => {
		if (newTimeRange === 'custom') {
			setShowCustomModal(true);
		} else {
			setCurrentTimeRange(newTimeRange);
			setCustomRange(undefined);
		}
	};

	const handleCustomDateApply = (customDateRange: CustomDateRange) => {
		setCustomRange(customDateRange);
		setCurrentTimeRange('custom');
		setShowCustomModal(false);
	};

	const currentFilterOption =
		filterOptions.find((item) => item.value === currentFilter) ||
		filterOptions[0];
	const currentTimeRangeOption = useMemo(() => {
		if (currentTimeRange === 'custom' && customRange) {
			const start = new Date(customRange.startDate);
			const end = new Date(customRange.endDate);
			const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			const endLabel = end.toLocaleDateString('en-US', { 
				month: 'short', 
				day: 'numeric',
				year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
			});
			return { label: `${startLabel} - ${endLabel}`, value: 'custom' };
		}
		return timeRangeOptions.find((item) => item.value === currentTimeRange) || timeRangeOptions[1];
	}, [currentTimeRange, customRange, timeRangeOptions]);

	// Loading state
	if (isLoading && products.length === 0) {
		return (
			<TrendingProductCard className={className}>
				<div className="flex items-center justify-center h-48">
					<div className="text-center">
						<Spinner size="xl" className="mb-4" />
						<p className="text-gray-500 dark:text-gray-400 text-sm">
							Loading trending products...
						</p>
					</div>
				</div>
			</TrendingProductCard>
		);
	}

	// Error state
	if (isError && products.length === 0) {
		return (
			<TrendingProductCard className={className}>
				<div className="flex flex-col items-center justify-center h-48">
					<HiExclamationCircle className="h-12 w-12 text-red-400 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						Failed to load data
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
						{error || 'Something went wrong while fetching trending products.'}
					</p>
					<Button
						size="sm"
						onClick={refetch}
						className="bg-blue-600 hover:bg-blue-700 border-0"
					>
						<HiRefresh className="mr-2 h-4 w-4" />
						Try Again
					</Button>
				</div>
			</TrendingProductCard>
		);
	}

	return (
		<>
			<TrendingProductCard className={className}>
				{/* Header */}
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-2">
							<HiChartBar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
								Trending Products
							</h2>
						</div>
						<TimeRangeSelect
							currentTimeRange={currentTimeRangeOption!}
							timeRangeOptions={timeRangeOptions}
							onTimeRangeChange={handleTimeRangeChange}
							isLoading={isLoading}
						/>
					</div>

					<FilterTabs
						currentFilter={currentFilterOption!}
						filterOptions={filterOptions}
						onFilterChange={handleFilterChange}
						isLoading={isLoading}
					/>
				</div>

				{/* Content */}
				<div className="relative flex-1 overflow-hidden">
					{isLoading && products.length > 0 && (
						<div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex items-center justify-center">
							<div className="text-center">
								<Spinner size="lg" className="mb-2" />
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Updating...
								</p>
							</div>
						</div>
					)}

					{products.length > 0 ? (
						<div className="h-full overflow-auto">
							<ProductTable products={products} />
						</div>
					) : (
						<div className="p-12 text-center">
							<div className="text-gray-400 dark:text-gray-500 mb-4">
								<HiChartBar className="mx-auto h-12 w-12" />
							</div>
							<h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
								No trending products
							</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								No data available for the selected period.
							</p>
						</div>
					)}
				</div>
			</TrendingProductCard>

			{/* Custom Date Range Modal */}
			<CustomDateModal
				isOpen={showCustomModal}
				onClose={() => setShowCustomModal(false)}
				onApply={handleCustomDateApply}
				currentRange={customRange}
			/>
		</>
	);
};
export default TrendingProducts;
