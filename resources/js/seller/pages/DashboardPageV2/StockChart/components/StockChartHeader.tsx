import { FC } from 'react';
import { HiChartPie, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

interface StockChartHeaderProps {
	productCount: number;
	growthPercentage: number;
	isPositiveGrowth: boolean;
	timeRange: 'today' | 'week' | 'month' | 'year';
}

const StockChartHeader: FC<StockChartHeaderProps> = ({
	productCount,
	growthPercentage,
	isPositiveGrowth,
	timeRange
}) => {
	const formatProductCount = (count: number) => {
		if (count >= 1000) {
			return (count / 1000).toFixed(1) + 'k';
		}
		return count.toString();
	};

	const getTimeRangeLabel = (range: string) => {
		switch (range) {
			case 'today': return 'today';
			case 'week': return 'this week';
			case 'month': return 'this month';
			case 'year': return 'this year';
			default: return 'this period';
		}
	};

	return (
		<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="bg-white/20 p-3 rounded-lg">
						<HiChartPie className="w-8 h-8" />
					</div>
					<div>
						<h2 className="text-2xl font-bold mb-1">
							{formatProductCount(productCount)}
						</h2>
						<p className="text-blue-100">
							Stock products {getTimeRangeLabel(timeRange)}
						</p>
					</div>
				</div>
				<div className="text-right">
					<div className="flex items-center space-x-2 mb-1">
						{isPositiveGrowth ? (
							<HiTrendingUp className="w-5 h-5 text-green-300" />
						) : (
							<HiTrendingDown className="w-5 h-5 text-red-300" />
						)}
						<span className={`text-lg font-semibold ${
							isPositiveGrowth ? 'text-green-300' : 'text-red-300'
						}`}>
							{isPositiveGrowth ? '+' : '-'}{growthPercentage}%
						</span>
					</div>
					<p className="text-xs text-blue-200">vs previous period</p>
				</div>
			</div>
		</div>
	);
};

export default StockChartHeader;