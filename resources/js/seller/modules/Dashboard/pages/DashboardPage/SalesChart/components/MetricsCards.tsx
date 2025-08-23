import { FC } from 'react';
import { Spinner } from 'flowbite-react';
import { HiCurrencyDollar, HiShoppingBag, HiTrendingUp } from 'react-icons/hi';
import { MetricsCardsProps } from '../types';

const MetricsCards: FC<MetricsCardsProps> = ({ 
	totals, 
	formatCurrency, 
	showFilterLoader 
}) => {
	return (
		<div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
			{/* Revenue Card */}
			<div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-2 sm:p-4 rounded-lg border border-green-200 dark:border-green-700 relative">
				{showFilterLoader && (
					<div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 rounded-lg flex items-center justify-center">
						<Spinner size="sm" />
					</div>
				)}
				<div className="flex items-center justify-between">
					<div className="min-w-0 flex-1">
						<p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 mb-1">Total Revenue</p>
						<p className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-300 truncate">
							{formatCurrency(totals.revenue)}
						</p>
					</div>
					<HiCurrencyDollar className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0 ml-2" />
				</div>
			</div>

			{/* Orders Card */}
			<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-2 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-700 relative">
				{showFilterLoader && (
					<div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 rounded-lg flex items-center justify-center">
						<Spinner size="sm" />
					</div>
				)}
				<div className="flex items-center justify-between">
					<div className="min-w-0 flex-1">
						<p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Orders</p>
						<p className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300 truncate">
							{totals.orders.toLocaleString()}
						</p>
					</div>
					<HiShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0 ml-2" />
				</div>
			</div>

			{/* Profit Card */}
			<div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-2 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-700 relative">
				{showFilterLoader && (
					<div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 rounded-lg flex items-center justify-center">
						<Spinner size="sm" />
					</div>
				)}
				<div className="flex items-center justify-between">
					<div className="min-w-0 flex-1">
						<p className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Total Profit</p>
						<p className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300 truncate">
							{formatCurrency(totals.profit)}
						</p>
					</div>
					<HiTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0 ml-2" />
				</div>
			</div>
		</div>
	);
};

export default MetricsCards;