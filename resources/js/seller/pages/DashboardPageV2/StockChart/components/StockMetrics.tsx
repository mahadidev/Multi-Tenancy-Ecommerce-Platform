import { FC, useMemo } from 'react';
import { HiShoppingBag, HiCurrencyDollar, HiTrendingUp, HiCube } from 'react-icons/hi';

interface StockMetricsProps {
	productReport: any;
	timeRange: 'today' | 'week' | 'month' | 'year';
}

const StockMetrics: FC<StockMetricsProps> = ({ productReport, timeRange }) => {
	const metrics = useMemo(() => {
		const chartSeries = productReport?.chartSeries || {};
		const entries = Object.entries(chartSeries);
		
		if (entries.length === 0) {
			return {
				totalBuyingValue: 0,
				totalSellingValue: 0,
				totalQuantity: 0
			};
		}

		const totalBuyingValue = entries.reduce((sum, [_, data]: [string, any]) => 
			sum + (data?.buyingValue || 0), 0);
		const totalSellingValue = entries.reduce((sum, [_, data]: [string, any]) => 
			sum + (data?.sellingValue || 0), 0);
		const totalQuantity = entries.reduce((sum, [_, data]: [string, any]) => 
			sum + (data?.qty || 0), 0);

		return {
			totalBuyingValue,
			totalSellingValue,
			totalQuantity
		};
	}, [productReport]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0
		}).format(amount).replace('BDT', '৳');
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	};

	const metricsData = [
		{
			title: 'Total Buying Value',
			value: formatCurrency(metrics.totalBuyingValue),
			icon: HiShoppingBag,
			color: 'text-blue-600 dark:text-blue-400',
			bgColor: 'bg-blue-100 dark:bg-blue-900/20'
		},
		{
			title: 'Total Selling Value',
			value: formatCurrency(metrics.totalSellingValue),
			icon: HiCurrencyDollar,
			color: 'text-green-600 dark:text-green-400',
			bgColor: 'bg-green-100 dark:bg-green-900/20'
		},
		{
			title: 'Total Quantity',
			value: formatNumber(metrics.totalQuantity),
			icon: HiCube,
			color: 'text-purple-600 dark:text-purple-400',
			bgColor: 'bg-purple-100 dark:bg-purple-900/20'
		}
	];

	return (
		<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{metricsData.map((metric, index) => {
					const IconComponent = metric.icon;
					return (
						<div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
							<div className="flex items-center space-x-3">
								<div className={`p-2 rounded-lg ${metric.bgColor}`}>
									<IconComponent className={`w-5 h-5 ${metric.color}`} />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
										{metric.title}
									</p>
									<p className="text-lg font-bold text-gray-900 dark:text-white truncate">
										{metric.value}
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default StockMetrics;