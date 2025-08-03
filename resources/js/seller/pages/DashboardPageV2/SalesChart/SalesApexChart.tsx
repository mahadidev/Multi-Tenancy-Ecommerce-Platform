import { ApexChart } from '@seller/components';
import useOrders from '@seller/hooks/useOrders';
import { useThemeMode } from 'flowbite-react';

function SalesApexChart() {
	const { report: orderReport } = useOrders({});
	const { mode } = useThemeMode();
	const isDarkTheme = mode === 'dark';

	const borderColor = isDarkTheme ? '#374151' : '#F3F4F6';
	const labelColor = isDarkTheme ? '#9ca3af' : '#6B7280';
	const opacityFrom = isDarkTheme ? 0 : 0.45;
	const opacityTo = isDarkTheme ? 0.15 : 0;

	// Transform chartSeries into the format ApexCharts expects
	const chartSeries = orderReport?.chartSeries;
	const categories = Object.keys(chartSeries || {});

	// Revenue Series
	const revenueData = categories.map((category) => ({
		x: category,
		y: chartSeries ? chartSeries[category]?.revenue : 0,
	}));

	// Qty Series
	const qtyData = categories.map((category) => ({
		x: category,
		y: chartSeries ? chartSeries[category]?.product_qty : 0,
	}));

	// Combine both series into a format ApexCharts expects
	const combinedSeries = [
		{
			name: 'Revenue',
			data: revenueData,
		},
		{
			name: 'Qty',
			data: qtyData,
		},
	];

	const options: ApexCharts.ApexOptions = {
		stroke: {
			curve: 'smooth',
		},
		chart: {
			type: 'area',
			fontFamily: 'Inter, sans-serif',
			foreColor: labelColor,
			toolbar: {
				show: false,
			},
		},
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom,
				opacityTo,
				type: 'vertical',
			},
		},
		dataLabels: {
			enabled: false,
		},
		tooltip: {
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
			y: {
				formatter: (val: number, opts) => {
					const seriesName = opts?.seriesIndex === 0 ? 'Revenue' : 'Qty';
					return seriesName === 'Revenue' ? `৳${val}` : `${val}`;
				},
			},
		},
		grid: {
			show: true,
			borderColor: borderColor,
			strokeDashArray: 1,
			padding: {
				left: 35,
				bottom: 15,
			},
		},
		markers: {
			size: 5,
			strokeColors: '#ffffff',
			hover: {
				size: undefined,
				sizeOffset: 3,
			},
		},
		xaxis: {
			categories: categories,
			labels: {
				style: {
					colors: [labelColor],
					fontSize: '14px',
					fontWeight: 500,
				},
			},
			axisBorder: {
				color: borderColor,
			},
			axisTicks: {
				color: borderColor,
			},
			crosshairs: {
				show: true,
				position: 'back',
				stroke: {
					color: borderColor,
					width: 1,
					dashArray: 10,
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: [labelColor],
					fontSize: '14px',
					fontWeight: 500,
				},
			},
		},
		legend: {
			fontSize: '14px',
			fontWeight: 500,
			fontFamily: 'Inter, sans-serif',
			labels: {
				colors: [labelColor],
			},
			itemMargin: {
				horizontal: 10,
			},
		},
		responsive: [
			{
				breakpoint: 1024,
				options: {
					xaxis: {
						labels: {
							show: false,
						},
					},
				},
			},
		],
	};

	return (
		<ApexChart
			height={420}
			options={options}
			series={combinedSeries}
			type="area"
		/>
	);
}

export default SalesApexChart;
