import { FC } from 'react';
import { Link } from 'react-router-dom';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { TopProductType } from '@type/orderType';
import ProductImagePlaceholder from '@seller/components/ProductImagePlaceholder';

interface ProductCardProps {
	product: TopProductType;
	index: number;
	showTrend?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({ product, index, showTrend = true }) => {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0
		}).format(amount).replace('BDT', '৳');
	};

	const formatNumber = (num: number) => {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		return num.toString();
	};

	// Simulate trend - in real implementation, this would come from API
	const trend = Math.random() > 0.5 ? 'up' : 'down';
	const trendPercentage = Math.floor(Math.random() * 50) + 1;

	return (
		<Link
			to={`/products/${product.product.id}`}
			className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 overflow-hidden"
		>
			<div className="p-4">
				{/* Header with rank and trend */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-2">
						<span className="text-xs font-bold text-gray-400 dark:text-gray-500">
							#{index + 1}
						</span>
						{showTrend && (
							<div className="flex items-center space-x-1">
								{trend === 'up' ? (
									<HiTrendingUp className="w-3 h-3 text-green-500" />
								) : (
									<HiTrendingDown className="w-3 h-3 text-red-500" />
								)}
								<span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
									{trendPercentage}%
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Product Image */}
				<div className="mb-3">
					<div className="w-full h-24 rounded-lg overflow-hidden">
						{product.product?.thumbnail ? (
							<img
								src={product.product.thumbnail}
								alt={product.product?.name || "Product"}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
							/>
						) : (
							<ProductImagePlaceholder />
						)}
					</div>
				</div>

				{/* Product Name */}
				<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
					{product.product?.name}
				</h3>

				{/* Metrics */}
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<span className="text-xs text-gray-500 dark:text-gray-400">Revenue</span>
						<span className="text-sm font-bold text-gray-900 dark:text-white">
							{formatCurrency(product.total_revenue)}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-xs text-gray-500 dark:text-gray-400">Sold</span>
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{formatNumber(product.total_quantity)} units
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;