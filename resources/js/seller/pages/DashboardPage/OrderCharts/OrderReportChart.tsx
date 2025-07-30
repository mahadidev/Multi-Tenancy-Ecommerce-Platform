import useOrders from '@seller/hooks/useOrders';
import { useFetchOrderReportQuery } from '@seller/store/reducers/orderApi';
import { ApexOptions } from 'apexcharts';
import { Button, Card } from 'flowbite-react';
import { useMemo, useState } from 'react';
import ApexChart from 'react-apexcharts';

const OrderReportChart = () => {
	const [range, setRange] = useState<'today' | 'week' | 'month' | 'year'>(
		'month'
	);
	const { report: orderReport } = useOrders({});

	useFetchOrderReportQuery({ range }, { refetchOnMountOrArgChange: true });

    const ranges: {
			label: string;
			value: 'today' | 'week' | 'month' | 'year';
		}[] = [
			{ label: 'Today', value: 'today' },
			{ label: 'This Week', value: 'week' },
			{ label: 'This Month', value: 'month' },
			{ label: 'This Year', value: 'year' },
		];


	const chartData = useMemo(() => {
		if (!orderReport?.daily_trends)
			return { dates: [], orders: [], revenue: [] };

		return {
			dates: orderReport.daily_trends.map((item) => item.date),
			orders: orderReport.daily_trends.map((item) => item.order_count),
			revenue: orderReport.daily_trends.map((item) => item.revenue),
		};
	}, [orderReport]);

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
			categories: chartData.dates.map((date) =>
				new Date(date).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
				})
			),
			title: { text: 'Date' },
		},
		yaxis: [
			{
				title: { text: 'Orders' },
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
							{orderReport?.total_orders || 0}
						</p>
					</div>
					<div className="bg-green-50 p-4 rounded-lg">
						<p className="text-sm text-gray-600">Revenue</p>
						<p className="text-xl font-bold">
							৳{orderReport?.paid_revenue?.toFixed(2) || '0.00'}
						</p>
					</div>
					<div className="bg-purple-50 p-4 rounded-lg">
						<p className="text-sm text-gray-600">Pending Payment</p>
						<p className="text-xl font-bold">
							৳{orderReport?.pending_revenue?.toFixed(2) || '0.00'}
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
