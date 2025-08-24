import { FC } from 'react';
import { Link } from 'react-router-dom';
import { HiTrendingUp, HiTrendingDown, HiMinus } from 'react-icons/hi';
import { ProductListItemProps } from '../types';

const ProductListItem: FC<ProductListItemProps> = ({ product, index, timeRange }) => {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0
		}).format(amount).replace('BDT', '৳');
	};

	const getRankBadge = (index: number) => {
		if (index === 0) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-700' };
		if (index === 1) return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-600' };
		if (index === 2) return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-700' };
		return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-700' };
	};

	const rankStyle = getRankBadge(index);

	// Simulate trend (in real implementation, this would come from data)
	const getTrend = () => {
		const trends = ['up', 'down', 'neutral'];
		return trends[Math.floor(Math.random() * trends.length)];
	};

	const trend = getTrend();

	const getTrendIcon = () => {
		switch (trend) {
			case 'up': return <HiTrendingUp className="w-3 h-3 text-green-500" />;
			case 'down': return <HiTrendingDown className="w-3 h-3 text-red-500" />;
			default: return <HiMinus className="w-3 h-3 text-gray-400" />;
		}
	};

	return (
		<li className="py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150">
			<div className="flex items-center space-x-4">
				{/* Rank Badge */}
				<div className={`flex-shrink-0 w-8 h-8 ${rankStyle.bg} ${rankStyle.border} border rounded-full flex items-center justify-center`}>
					<span className={`text-xs font-bold ${rankStyle.text}`}>
						#{index + 1}
					</span>
				</div>

				{/* Product Image */}
				<div className="flex-shrink-0">
					<Link to={`products/${product.product.id}`}>
						<div className="w-12 h-12 rounded-lg object-center overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600">
							{product.product?.thumbnail ? (
								<img
									className="w-full h-full object-cover"
									src={product.product.thumbnail}
									alt={product.product?.name || "Product"}
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
									<span className="text-xs text-gray-400">IMG</span>
								</div>
							)}
						</div>
					</Link>
				</div>

				{/* Product Info */}
				<div className="min-w-0 flex-1">
					<Link 
						to={`products/${product.product.id}`} 
						className="block group"
					>
						<div className="flex items-center space-x-2 mb-1">
							<p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
								{product.product?.name}
							</p>
							{getTrendIcon()}
						</div>
						<div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
							<span>Sold: {product.total_quantity} units</span>
							<span>•</span>
							<span>Period: {timeRange}</span>
						</div>
					</Link>
				</div>

				{/* Revenue */}
				<div className="flex-shrink-0 text-right">
					<div className="text-base font-bold text-gray-900 dark:text-white">
						{formatCurrency(product.total_revenue)}
					</div>
					<div className="text-xs text-gray-500 dark:text-gray-400">
						Revenue
					</div>
				</div>
			</div>
		</li>
	);
};

export default ProductListItem;