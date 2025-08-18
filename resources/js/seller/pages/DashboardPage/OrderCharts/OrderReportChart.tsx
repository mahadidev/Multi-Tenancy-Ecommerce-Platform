import useSalesChart from '@seller/hooks/useSalesChart';
import { ApexOptions } from 'apexcharts';
import { Button, Card } from 'flowbite-react';
import { useMemo, useState } from 'react';
import ApexChart from 'react-apexcharts';

const OrderReportChart = () => {
	const [range, setRange] = useState<'today' | 'last7days' | 'last30days' | 'last1year'>(
		'last30days'
	);
	const { report: salesReport } = useSalesChart({ reportFilterRange: range });

    const ranges: {
			label: string;
			value: 'today' | 'last7days' | 'last30days' | 'last1year';
		}[] = [
			{ label: 'Today', value: 'today' },
			{ label: 'Last 7 Days', value: 'last7days' },
			{ label: 'Last 30 Days', value: 'last30days' },
			{ label: 'Last 1 Year', value: 'last1year' },
		];


	const chartData = useMemo(() => {
		if (!salesReport?.daily_trends)
			return { dates: [], qty: [], revenue: [] };

		return {
			dates: salesReport.daily_trends.map((item: any) => item.date),
			qty: salesReport.daily_trends.map((item: any) => item.product_qty),
			revenue: salesReport.daily_trends.map((item: any) => item.revenue),
		};
	}, [salesReport]);

	const chartOptions: ApexOptions = {
		chart: {
			id: 'order-report',
			type: 'area',
			toolbar: { show: true },
			zoom: { enabled: false },
		},
		colors: ['#3b82f6', '#10b981'],
		dataLabels: { enabled: false },
		stroke: {
			curve: 'smooth',
			width: 2,
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.4,
				opacityTo: 0.1,
				stops: [0, 90, 100],
			},
		},
		xaxis: {
			categories: chartData.dates.map((date: any) =>
				new Date(date).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
				})
			),
			title: { text: 'Date' },
		},
		yaxis: [
			{
				title: { text: 'Qty' },
				labels: {
					formatter: (val: number) => `${Math.round(val)}`,
				},
			},
			{
				opposite: true,
				title: { text: 'Revenue' },
				labels: {
					formatter: (val: number) => `৳${val.toFixed(2)}`,
				},
			},
		],
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (val: number, opts) => {
					const name = opts?.series[opts.seriesIndex]?.name;
					return name === 'Revenue' ? `৳${val.toFixed(2)}` : `${val}`;
				},
			},
		},
		legend: {
			show: true,
			position: 'top',
		},
	};

	// const chartSeries = [
	// 	{
	// 		name: 'Orders',
	// 		type: 'area',
	// 		data: chartData.orders,
	// 	},
	// 	{
	// 		name: 'Revenue',
	// 		type: 'area',
	// 		data: chartData.revenue,
	// 	},
	// ];

	return (
		<>
			<div className="w-full col-span-full flex flex-wrap justify-between items-center gap-2">
				<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<p className="text-sm text-gray-600">Total Orders</p>
						<p className="text-xl font-bold">
							{salesReport?.total_orders || 0}
						</p>
					</div>
					<div className="bg-green-50 p-4 rounded-lg">
						<p className="text-sm text-gray-600">Revenue</p>
						<p className="text-xl font-bold">
							৳{salesReport?.paid_revenue?.toFixed(2) || '0.00'}
						</p>
					</div>
					<div className="bg-purple-50 p-4 rounded-lg">
						<p className="text-sm text-gray-600">Pending Payment</p>
						<p className="text-xl font-bold">
							৳{salesReport?.pending_revenue?.toFixed(2) || '0.00'}
						</p>
					</div>
				</div>
			</div>
			<Card className="w-full col-span-full">
				<div className="flex flex-wrap justify-between items-center mb-4 gap-2">
					<h5 className="text-lg font-semibold">Order Report</h5>
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

				{chartData.dates.length > 0 ? (
					<>
						<ApexChart
							options={chartOptions}
							series={[]}
							type="area" // ✅ switched to area chart
							height={350}
						/>
					</>
				) : (
					<div className="text-center text-gray-500 py-8">
						No order data available
					</div>
				)}
			</Card>
		</>
	);
};

export default OrderReportChart;
