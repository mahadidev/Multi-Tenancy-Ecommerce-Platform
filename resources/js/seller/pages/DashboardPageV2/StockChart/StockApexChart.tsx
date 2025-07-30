import { ApexChart } from '@seller/components';
import useProduct from '@seller/hooks/useProduct';
import 'svgmap/dist/svgMap.min.css';

function StockApexChart() {
	const { summary: productSummary } = useProduct({
		summaryFilterRange: 'month',
	});

	// Transform chartSeries into the format ApexCharts expects
	const chartSeries = productSummary?.chartSeries;
	const categories = Object.keys(chartSeries || {});

	// Buying Series
	const seriesBuyingData = categories.map((category) => ({
		x: category, // Date as the category
		y: chartSeries ? chartSeries[category]?.buyingValue : 0, // Buying Quantity
	}));

	// Selling Series
	const seriesSellingData = categories.map((category) => ({
		x: category, // Date as the category
		y: chartSeries ? chartSeries[category]?.sellingValue : 0, // Selling Value
	}));

	// Qty Series (Optional but can be used for better tracking of stock)
	const seriesQtyData = categories.map((category) => ({
		x: category, // Date as the category
		y: chartSeries ? chartSeries[category]?.qty : 0, // Quantity (stock)
	}));

	// Combine the three series (Buying, Selling, and Qty)
	const combinedSeries = [
		{
			name: 'Buying Value',
			data: seriesBuyingData,
		},
		{
			name: 'Selling Value',
			data: seriesSellingData,
		},
		{
			name: 'Quantity',
			data: seriesQtyData,
		},
	];

	const options: ApexCharts.ApexOptions = {
		colors: ['#1A56DB', '#FDBA8C', '#28A745'], // Different colors for each line
		chart: {
			fontFamily: 'Inter, sans-serif',
			foreColor: '#4B5563',
			toolbar: {
				show: false,
			},
			type: 'line', // Change chart type to line chart
		},
		stroke: {
			curve: 'smooth', // Smooth curve for line chart
			width: 3,
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
			y: {
				formatter: (val: number, opts) => {
					const seriesName =
						opts?.seriesIndex === 0
							? 'Buying'
							: opts?.seriesIndex === 1
							? 'Selling'
							: 'Qty';
					return seriesName === 'Buying'
						? `৳${val}`
						: seriesName === 'Selling'
						? `৳${val}`
						: `${val}`;
				},
			},
		},
		grid: {
			show: true,
			borderColor: '#E5E7EB',
			strokeDashArray: 1,
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		xaxis: {
			categories: categories, // Dates will be the X-axis categories
			labels: {
				style: {
					colors: '#4B5563',
					fontSize: '12px',
					fontWeight: 500,
				},
			},
		},
		yaxis: {
            show: false,
			title: {
				text: 'Values / Quantity',
			},
			labels: {
				style: {
					colors: '#4B5563',
					fontSize: '12px',
					fontWeight: 500,
				},
			},
		},
	};

	return (
		<ApexChart
			height={305}
			options={options}
			series={combinedSeries} // Pass all three series
			type="bar" // Line chart
		/>
	);
}

export default StockApexChart;
