import useProduct from '@seller/_hooks/useProduct';
import { Spinner } from 'flowbite-react';
import { FC } from 'react';
import { HiCube } from 'react-icons/hi';

interface StockChartProps {
	className?: string;
}

const StockChart: FC<StockChartProps> = ({ className = '' }) => {
	const { summary: productReport } = useProduct({
		summaryFilterRange: 'month'
	});

	// Loading state
	if (!productReport) {
		return (
			<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6 ${className}`}>
				<div className="flex items-center justify-center h-32">
					<div className="text-center">
						<Spinner size="lg" className="mb-3" />
						<p className="text-gray-500 dark:text-gray-400 text-sm">
							Loading stock data...
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Extract key metrics
	const totalProducts = productReport?.totalProducts || 0;
	const lowStock = productReport?.lowStock || 0;
	const outOfStock = productReport?.outOfStock || 0;
	const totalValue = productReport?.totalValue || 0;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0
		}).format(amount).replace('BDT', '৳');
	};

	return (
		<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}>
			{/* Minimal Header */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-2">
					<HiCube className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<h3 className="text-base font-medium text-gray-900 dark:text-white">Stock Overview</h3>
				</div>
			</div>

			{/* Simple Metrics Grid */}
			<div className="p-4">
				<div className="grid grid-cols-2 gap-4">
					{/* Total Products */}
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900 dark:text-white">
							{totalProducts.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Total Products
						</div>
					</div>

					{/* Total Value */}
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600 dark:text-green-400">
							{formatCurrency(totalValue)}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Stock Value
						</div>
					</div>

					{/* Low Stock */}
					<div className="text-center">
						<div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
							{lowStock.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Low Stock
						</div>
					</div>

					{/* Out of Stock */}
					<div className="text-center">
						<div className="text-2xl font-bold text-red-600 dark:text-red-400">
							{outOfStock.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							Out of Stock
						</div>
					</div>
				</div>

				{/* Simple Progress Bar for Stock Levels */}
				<div className="mt-6">
					<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
						<span>Stock Health</span>
						<span>{Math.round(((totalProducts - outOfStock) / totalProducts) * 100) || 0}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
						<div 
							className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
							style={{ 
								width: `${Math.round(((totalProducts - outOfStock) / totalProducts) * 100) || 0}%` 
							}}
						></div>
					</div>
					<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
						<span>Critical</span>
						<span>Healthy</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StockChart;