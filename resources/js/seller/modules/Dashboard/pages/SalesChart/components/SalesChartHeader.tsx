import { FC } from 'react';
import { HiChartBar, HiTrendingDown, HiTrendingUp } from 'react-icons/hi';
import { SalesChartHeaderProps } from '../types';

const SalesChartHeader: FC<SalesChartHeaderProps> = ({
	growthPercentage,
	isPositiveGrowth
}) => {
	return (
		<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="bg-white/20 p-3 rounded-lg">
						<HiChartBar className="w-8 h-8" />
					</div>
					<div>
						<h2 className="text-2xl font-bold mb-1">Sales Analytics</h2>
						<p className="text-blue-100">Track your sales performance over time</p>
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
							{isPositiveGrowth ? '+' : ''}{growthPercentage}%
						</span>
					</div>
					<p className="text-xs text-blue-200">vs previous period</p>
				</div>
			</div>
		</div>
	);
};

export default SalesChartHeader;
