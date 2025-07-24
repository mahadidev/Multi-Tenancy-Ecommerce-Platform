import useProduct from '@seller/hooks/useProduct';
import { ApexOptions } from 'apexcharts';
import { Button, Card } from 'flowbite-react';
import { useMemo, useState } from 'react';
import ApexChart from 'react-apexcharts';

const ProductStockHistoryChart = () => {
	// State to manage the selected date range
	const [range, setRange] = useState<'today' | 'week' | 'month' | 'year' | any>(
		'month'
	);

	// Get the summary data using your custom hook
	const { summary: summaryData } = useProduct({summaryFilterRange: range});

	// Define available ranges for filtering
	const ranges = [
		{ label: 'Today', value: 'today' },
		{ label: 'This Week', value: 'week' },
		{ label: 'This Month', value: 'month' },
		{ label: 'This Year', value: 'year' },
	];

	// Get the first key of the summaryData object (e.g., a date, month, etc.)
	const firstKey = summaryData ? Object.keys(summaryData)[0] : null;

	// Fixing types for chart data and calculating series values
	const chartData = useMemo(() => {
		if (!summaryData)
			return { labels: [], qty: [], sellingValue: [], buyingValue: [] };

		const labels = Object.keys(summaryData); // Get the dynamic keys (like dates, months, etc.)

		// Map over the labels and extract qty, sellingValue, buyingValue for each key
		const qty = labels.map((key) => summaryData[key]?.qty || 0);
		const sellingValue = labels.map(
			(key) => summaryData[key]?.sellingValue || 0
		);
		const buyingValue = labels.map((key) => summaryData[key]?.buyingValue || 0);

		return { labels, qty, sellingValue, buyingValue };
	}, [summaryData]);

	// ApexChart options for the stock history chart
	const chartOptions: ApexOptions = {
		chart: {
			id: 'product-stock-history',
			toolbar: { show: false },
			zoom: { enabled: false },
		},
		colors: ['#3b82f6', '#10b981', '#f59e0b'], // Blue for qty, Green for sellingValue, Yellow for buyingValue
		dataLabels: { enabled: false },
		stroke: { curve: 'smooth', width: 2 },
		xaxis: {
			categories: chartData.labels,
			title: { text: 'Time' },
		},
		yaxis: [
			{
				title: { text: 'Quantity' },
				labels: {
					formatter: (val: number) => `${val}`,
				},
			},
			{
				opposite: true,
				title: { text: 'Selling Value' },
				labels: {
					formatter: (val: number) => `৳${val}`,
				},
			},
			{
				opposite: true,
				title: { text: 'Buying Value' },
				labels: {
					formatter: (val: number) => `৳${val}`,
				},
			},
		],
		tooltip: {
			shared: true,
			y: {
				formatter: (val: number, opts) => {
					const seriesName =
						opts?.seriesIndex === 1
							? 'Selling Value'
							: opts?.seriesIndex === 2
							? 'Buying Value'
							: 'Quantity';
					return seriesName === 'Selling Value' || seriesName === 'Buying Value'
						? `৳${val}`
						: `${val}`;
				},
			},
		},
		legend: {
			show: true,
			position: 'top' as const,
		},
	};

	// Prepare the chart series
	const chartSeries = [
		{
			name: 'Quantity',
			data: chartData.qty,
			type: 'line',
		},
		{
			name: 'Selling Value',
			data: chartData.sellingValue,
			type: 'line',
		},
		{
			name: 'Buying Value',
			data: chartData.buyingValue,
			type: 'line',
		},
	];

	// Accessing the dynamic key data based on the first key of the summaryData object
	const currentSummary = (summaryData && firstKey)
		? summaryData[firstKey]
		: { qty: 0, sellingValue: 0, buyingValue: 0 };

	return (
		<div className="space-y-4 col-span-full">
			{/* Display Current Stock Summary Cards */}
			<div className="grid grid-cols-3 gap-4">
				<Card className="w-full">
					<h5 className="text-lg font-semibold">Current Stock Quantity</h5>
					<div className="text-2xl font-bold">{currentSummary?.qty}</div>
				</Card>

				<Card className="w-full">
					<h5 className="text-lg font-semibold">Current Selling Value</h5>
					<div className="text-2xl font-bold">
						৳{currentSummary?.sellingValue}
					</div>
				</Card>

				<Card className="w-full">
					<h5 className="text-lg font-semibold">Current Buying Value</h5>
					<div className="text-2xl font-bold">
						৳{currentSummary?.buyingValue}
					</div>
				</Card>
			</div>

			{/* Stock History Chart */}
			<Card className="w-full col-span-full">
				<div className="flex flex-wrap justify-between items-center mb-4 gap-2">
					<h5 className="text-lg font-semibold">Stock History</h5>
					<div className="flex gap-2">
						{ranges.map((r) => (
							<Button
								size="xs"
								key={r.value}
								color={range === r.value ? 'blue' : 'gray'}
								onClick={() => setRange(r.value)}
							>
								{r.label}
							</Button>
						))}
					</div>
				</div>

				{chartData.labels.length > 0 ? (
					<ApexChart
						options={chartOptions}
						series={chartSeries}
						type="line"
						height={300}
					/>
				) : (
					<div className="text-center text-gray-500 py-8">
						No stock history available
					</div>
				)}
			</Card>
		</div>
	);
};

export default ProductStockHistoryChart;
