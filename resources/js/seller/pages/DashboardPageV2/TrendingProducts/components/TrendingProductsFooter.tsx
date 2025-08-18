import { FC } from 'react';
import { HiTrendingUp, HiCurrencyDollar, HiShoppingBag } from 'react-icons/hi';

interface TrendingProductsFooterProps {
	products: any[];
	period: string;
	filterType: string;
}

const TrendingProductsFooter: FC<TrendingProductsFooterProps> = ({
	products,
	period,
	filterType
}) => {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0
		}).format(amount).replace('BDT', '৳');
	};

	const totalRevenue = products.reduce((sum, product) => sum + product.total_revenue, 0);
	const totalQuantity = products.reduce((sum, product) => sum + product.total_quantity, 0);
	const averagePrice = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;

	const getFilterLabel = () => {
		switch (filterType) {
			case 'most_revenue': return 'by Revenue';
			case 'most_profitable': return 'by Profit';
			case 'recently_popular': return 'by Popularity';
			case 'top_selling': return 'by Sales';
			default: return '';
		}
	};

	if (products.length === 0) return null;

	return (
		<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				{/* Stats */}
				<div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
					<div className="flex items-center space-x-2">
						<HiCurrencyDollar className="w-4 h-4 text-green-500" />
						<span>Total: {formatCurrency(totalRevenue)}</span>
					</div>
					<div className="flex items-center space-x-2">
						<HiShoppingBag className="w-4 h-4 text-blue-500" />
						<span>Units: {totalQuantity.toLocaleString()}</span>
					</div>
					<div className="flex items-center space-x-2">
						<HiTrendingUp className="w-4 h-4 text-purple-500" />
						<span>Avg: {formatCurrency(averagePrice)}</span>
					</div>
				</div>

				{/* Filter Info */}
				<div className="text-xs text-gray-500 dark:text-gray-400">
					Top {products.length} products {getFilterLabel()} • {period}
				</div>
			</div>
		</div>
	);
};

export default TrendingProductsFooter;