import { FC, useMemo } from 'react';
import { HiShoppingBag, HiCurrencyDollar, HiCube, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

interface StockData {
	buyingValue: number;
	sellingValue: number;
	quantity: number;
	profit: number;
}

interface StockReportStatsProps {
	data: StockData[];
	timeRange: 'today' | 'week' | 'month' | 'year';
}

const StockReportStats: FC<StockReportStatsProps> = ({ data, timeRange }) => {
	const stats = useMemo(() => {
		if (!data.length) {
			return {
				totalBuying: 0,
				totalSelling: 0,
				totalQuantity: 0,
				totalProfit: 0,
				avgProfit: 0,
				profitMargin: 0,
				growth: 0
			};
		}

		const totalBuying = data.reduce((sum, item) => sum + item.buyingValue, 0);
		const totalSelling = data.reduce((sum, item) => sum + item.sellingValue, 0);
		const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
		const totalProfit = totalSelling - totalBuying;
		const avgProfit = totalProfit / data.length;
		const profitMargin = totalSelling ? ((totalProfit / totalSelling) * 100) : 0;

		// Calculate growth (comparing first half vs second half of data)
		const midPoint = Math.floor(data.length / 2);
		const firstHalf = data.slice(0, midPoint);
		const secondHalf = data.slice(midPoint);
		
		const firstHalfProfit = firstHalf.reduce((sum, item) => sum + item.profit, 0);
		const secondHalfProfit = secondHalf.reduce((sum, item) => sum + item.profit, 0);
		
		const growth = firstHalfProfit ? ((secondHalfProfit - firstHalfProfit) / firstHalfProfit) * 100 : 0;

		return {
			totalBuying,
			totalSelling,
			totalQuantity,
			totalProfit,
			avgProfit,
			profitMargin,
			growth
		};
	}, [data]);

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

	const statsData = [
		{
			title: 'Total Buying Value',
			value: formatCurrency(stats.totalBuying),
			icon: HiShoppingBag,
			color: 'text-blue-600 dark:text-blue-400',
			bgColor: 'bg-blue-100 dark:bg-blue-900/20',
			change: null
		},
		{
			title: 'Total Selling Value',
			value: formatCurrency(stats.totalSelling),
			icon: HiCurrencyDollar,
			color: 'text-green-600 dark:text-green-400',
			bgColor: 'bg-green-100 dark:bg-green-900/20',
			change: null
		},
		{
			title: 'Total Quantity',
			value: formatNumber(stats.totalQuantity),
			suffix: 'items',
			icon: HiCube,
			color: 'text-purple-600 dark:text-purple-400',
			bgColor: 'bg-purple-100 dark:bg-purple-900/20',
			change: null
		},
		{
			title: 'Total Profit',
			value: formatCurrency(stats.totalProfit),
			icon: stats.totalProfit >= 0 ? HiTrendingUp : HiTrendingDown,
			color: stats.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
			bgColor: stats.totalProfit >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20',
			change: {
				value: Math.abs(stats.growth),
				isPositive: stats.growth >= 0
			}
		},
		{
			title: 'Profit Margin',
			value: `${stats.profitMargin.toFixed(1)}%`,
			icon: HiTrendingUp,
			color: stats.profitMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
			bgColor: stats.profitMargin >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20',
			change: null
		},
		{
			title: 'Average Profit',
			value: formatCurrency(stats.avgProfit),
			suffix: 'per period',
			icon: HiTrendingUp,
			color: stats.avgProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
			bgColor: stats.avgProfit >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-red-100 dark:bg-red-900/20',
			change: null
		}
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
			{statsData.map((stat, index) => {
				const IconComponent = stat.icon;
				return (
					<div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
						<div className="flex items-center justify-between mb-4">
							<div className={`p-3 rounded-lg ${stat.bgColor}`}>
								<IconComponent className={`w-6 h-6 ${stat.color}`} />
							</div>
							{stat.change && (
								<div className={`flex items-center space-x-1 text-xs font-medium ${
									stat.change.isPositive ? 'text-green-600' : 'text-red-600'
								}`}>
									{stat.change.isPositive ? (
										<HiTrendingUp className="w-3 h-3" />
									) : (
										<HiTrendingDown className="w-3 h-3" />
									)}
									<span>{stat.change.value.toFixed(1)}%</span>
								</div>
							)}
						</div>
						<div>
							<h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
								{stat.title}
							</h3>
							<div className="flex items-baseline space-x-1">
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{stat.value}
								</p>
								{stat.suffix && (
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{stat.suffix}
									</span>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default StockReportStats;