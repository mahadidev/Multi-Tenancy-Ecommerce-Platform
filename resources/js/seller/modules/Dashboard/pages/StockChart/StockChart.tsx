import useProduct from '@seller/_hooks/useProduct';
import { Spinner } from 'flowbite-react';
import { FC } from 'react';
import { HiCube, HiInformationCircle } from 'react-icons/hi';

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
	const totalBuyingValue = productReport?.totalBuyingValue || 0;
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
		<div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-visible ${className}`}>
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
						<div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
							<span>Total Products</span>
							<div className="relative group">
								<HiInformationCircle className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 w-40">
									<div className="text-center">Total number of products in your inventory</div>
									<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Total Value */}
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600 dark:text-green-400">
							{formatCurrency(totalValue)}
						</div>
						<div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
							<span>Stock Value</span>
							<div className="relative group">
								<HiInformationCircle className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 w-48">
									<div className="text-center">Current selling value after discounts (Price - Discount) × Quantity</div>
									<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Total Buying Value */}
					<div className="text-center">
						<div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
							{formatCurrency(totalBuyingValue)}
						</div>
						<div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
							<span>Investment</span>
							<div className="relative group">
								<HiInformationCircle className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 w-48">
									<div className="text-center">Total amount invested in purchasing inventory (Buying Price × Quantity)</div>
									<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Out of Stock */}
					<div className="text-center">
						<div className="text-2xl font-bold text-red-600 dark:text-red-400">
							{outOfStock.toLocaleString()}
						</div>
						<div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
							<span>Out of Stock</span>
							<div className="relative group">
								<HiInformationCircle className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 w-40">
									<div className="text-center">Number of products with zero inventory quantity</div>
									<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
								</div>
							</div>
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
