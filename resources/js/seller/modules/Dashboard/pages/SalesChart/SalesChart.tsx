import CustomDateModal, {
    CustomDateRange,
} from '@seller/components/DatePicker/CustomDateModal';
import { Card, Spinner } from 'flowbite-react';
import { useEffect, useMemo, useState } from 'react';
import { useDashboard } from '../../hooks';
import SalesApexChart from './SalesApexChart';
import { MetricsCards, SalesChartFooter, SalesChartHeader } from './components';
import { RangeOption, RangeType } from './types';

const SalesChart = () => {
	const rangeList: RangeOption[] = useMemo(
		() => [
			{ label: 'Today', value: 'today' },
			{ label: 'Last 7 Days', value: 'last7days' },
			{ label: 'Last 30 Days', value: 'last30days' },
			{ label: 'Last 1 Year', value: 'last1year' },
			{ label: 'Custom', value: 'custom' },
		],
		[]
	);

	const [range, setRange] = useState<RangeType>('last7days');
	const [customRange, setCustomRange] = useState<CustomDateRange>();
	const [showCustomModal, setShowCustomModal] = useState(false);
	const [isChangingFilter, setIsChangingFilter] = useState(false);

	const {
		report: salesReport,
		isSalesLoading: isSalesDataLoading,
		getSalesTotals: getTotals,
		getSalesGrowthPercentage: getGrowthPercentage,
	} = useDashboard({
		reportFilterRange: range,
		customDateRange: range === 'custom' ? customRange : undefined,
	});

	const handleRangeChange = (newRange: RangeType) => {
		if (newRange === 'custom') {
			setShowCustomModal(true);
		} else if (newRange !== range) {
			setIsChangingFilter(true);
			setRange(newRange);
			setCustomRange(undefined);
		}
	};

	const handleCustomDateApply = (customDateRange: CustomDateRange) => {
		setCustomRange(customDateRange);
		setRange('custom');
		setShowCustomModal(false);
		setIsChangingFilter(true);
	};

	useEffect(() => {
		if (!isSalesDataLoading && salesReport) {
			setIsChangingFilter(false);
		}
	}, [isSalesDataLoading, salesReport]);

	const loading = isSalesDataLoading || !salesReport;
	const showFilterLoader = isChangingFilter && isSalesDataLoading;

	const growthPercentage = useMemo(() => {
		const growth = getGrowthPercentage();
		return growth.toFixed(1);
	}, [getGrowthPercentage]);

	const isPositiveGrowth = parseFloat(growthPercentage) >= 0;

	const totals = useMemo(() => {
		return getTotals();
	}, [getTotals]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0,
		})
			.format(amount)
			.replace('BDT', '৳');
	};

	const currentRangeOption: RangeOption = useMemo(() => {
		if (range === 'custom' && customRange) {
			const start = new Date(customRange.startDate);
			const end = new Date(customRange.endDate);
			const startLabel = start.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			});
			const endLabel = end.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined,
			});
			return { label: `${startLabel} - ${endLabel}`, value: 'custom' };
		}
		return (
			rangeList.find((item) => item.value === range) || {
				label: 'Last 7 Days',
				value: 'last7days',
			}
		);
	}, [range, customRange, rangeList]);

	if (loading) {
		return (
			<div className="xl:col-span-2 rounded-xl bg-white shadow-lg border-0 overflow-hidden dark:bg-gray-800">
				<div className="p-8">
					<div className="flex items-center justify-center h-96">
						<div className="text-center">
							<Spinner size="xl" className="mb-4" />
							<p className="text-gray-500 dark:text-gray-400">
								Loading sales data...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<Card className="xl:col-span-2 border-0 relative">
				<SalesChartHeader
					growthPercentage={growthPercentage}
					isPositiveGrowth={isPositiveGrowth}
				/>

				<MetricsCards
					totals={totals}
					formatCurrency={formatCurrency}
					showFilterLoader={showFilterLoader}
				/>

				<div className=" dark:bg-gray-900 rounded-lg relative">
					{showFilterLoader && (
						<div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
							<div className="text-center">
								<Spinner size="lg" className="mb-2" />
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Updating chart...
								</p>
							</div>
						</div>
					)}
					<SalesApexChart range={range === 'custom' ? 'last30days' : range} />
				</div>

				<SalesChartFooter
					currentRange={currentRangeOption}
					rangeList={rangeList}
					onRangeChange={handleRangeChange}
					isLoading={showFilterLoader}
				/>
			</Card>

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

export default SalesChart;
