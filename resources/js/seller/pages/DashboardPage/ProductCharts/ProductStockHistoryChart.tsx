import useProductStockHistory from '@seller/hooks/useProductStockHistory';
import { ApexOptions } from 'apexcharts';
import { Button, Card } from 'flowbite-react';
import { useMemo, useState } from 'react';
import ApexChart from 'react-apexcharts';

const ProductStockHistoryChart = () => {
	const [range, setRange] = useState<'today' | 'week' | 'month' | 'year' | any>(
		'month'
	);
	const { allProductStockHistory } = useProductStockHistory({ range });

	const ranges = [
		{ label: 'Today', value: 'today' },
		{ label: 'This Week', value: 'week' },
		{ label: 'This Month', value: 'month' },
		{ label: 'This Year', value: 'year' },
	];

	const chartData = useMemo(() => {
		if (!allProductStockHistory) return { labels: [], qty: [], total: [] };

		const labels = Object.keys(allProductStockHistory);
		const qty = Object.values(allProductStockHistory).map((d: any) => d.qty);
		const total = Object.values(allProductStockHistory).map(
			(d: any) => d.total_value
		);

		return { labels, qty, total };
	}, [allProductStockHistory]);

	const chartOptions: ApexOptions = {
		chart: {
			id: 'product-stock-history',
			toolbar: { show: false },
			zoom: { enabled: false },
		},
		colors: ['#3b82f6', '#10b981'], // qty = blue, total_value = green
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
				title: { text: 'Total Value' },
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
						opts?.seriesIndex === 1 ? 'Total Value' : 'Quantity';
					return seriesName === 'Total Value' ? `৳${val}` : `${val}`;
				},
			},
		},
		legend: {
			show: true,
			position: 'top' as const,
		},
	};

    const chartSeries = [
			{
				name: 'Quantity',
				data: chartData.qty,
				type: 'line',
			},
			{
				name: 'Total Value',
				data: chartData.total,
				type: 'line',
			},
		];

	return (
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
	);
};

export default ProductStockHistoryChart;
