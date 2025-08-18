import useSalesChart from '@seller/hooks/useSalesChart';
import { Card, Spinner } from 'flowbite-react';
import { useEffect, useMemo, useState } from 'react';
import SalesApexChart from './SalesApexChart';
import { MetricsCards, SalesChartFooter, SalesChartHeader } from './components';
import { RangeOption, RangeType } from './types';

const SalesChart = () => {
	const rangeList: RangeOption[] = useMemo(() => [
		{ label: 'Today', value: 'today' },
		{ label: 'Last 7 Days', value: 'last7days' },
		{ label: 'Last 30 Days', value: 'last30days' },
		{ label: 'Last 1 Year', value: 'last1year' },
	], []);

	const [range, setRange] = useState<RangeType>('last7days');
	const [isChangingFilter, setIsChangingFilter] = useState(false);

	const { report: salesReport, isLoading: isSalesDataLoading, getTotals, getGrowthPercentage } = useSalesChart({
		reportFilterRange: range
	});

	const handleRangeChange = (newRange: RangeType) => {
		if (newRange !== range) {
			setIsChangingFilter(true);
			setRange(newRange);
		}
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
			minimumFractionDigits: 0
		}).format(amount).replace('BDT', '৳');
	};

	const currentRangeOption: RangeOption = rangeList.find(item => item.value === range) || { label: 'Last 7 Days', value: 'last7days' };

	if (loading) {
		return (
			<div className="xl:col-span-2 rounded-xl bg-white shadow-lg border-0 overflow-hidden dark:bg-gray-800">
				<div className="p-8">
					<div className="flex items-center justify-center h-96">
						<div className="text-center">
							<Spinner size="xl" className="mb-4" />
							<p className="text-gray-500 dark:text-gray-400">Loading sales data...</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
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
							<p className="text-sm text-gray-500 dark:text-gray-400">Updating chart...</p>
						</div>
					</div>
				)}
				<SalesApexChart range={range} />
			</div>

			<SalesChartFooter
				currentRange={currentRangeOption}
				rangeList={rangeList}
				onRangeChange={handleRangeChange}
				isLoading={showFilterLoader}
			/>
		</Card>
	);
};

export default SalesChart;
