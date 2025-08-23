import { FC, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiTrendingUp, HiTrendingDown, HiArrowRight, HiChevronUp, HiChevronDown } from 'react-icons/hi';
import { TopProductType } from '@type/orderType';

// CSS for thin scrollbar
const scrollbarStyles = `
.thin-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: #9CA3AF #F3F4F6;
}

.thin-scrollbar::-webkit-scrollbar {
	height: 8px;
}

.thin-scrollbar::-webkit-scrollbar-track {
	background: #F3F4F6;
	border-radius: 4px;
}

.thin-scrollbar::-webkit-scrollbar-thumb {
	background: #9CA3AF;
	border-radius: 4px;
}

.thin-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #6B7280;
}

.dark .thin-scrollbar {
	scrollbar-color: #6B7280 #374151;
}

.dark .thin-scrollbar::-webkit-scrollbar-track {
	background: #374151;
}

.dark .thin-scrollbar::-webkit-scrollbar-thumb {
	background: #6B7280;
}

.dark .thin-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #9CA3AF;
}
`;

type SortField = 'rank' | 'name' | 'sold' | 'revenue' | 'trend';
type SortDirection = 'asc' | 'desc';

interface ProductTableProps {
	products: TopProductType[];
	showTrend?: boolean;
}

const ProductTable: FC<ProductTableProps> = ({ products, showTrend = true }) => {
	const [sortField, setSortField] = useState<SortField>('rank');
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
	// Using product ID to ensure consistent trend values
	const getTrendData = (productId: number) => {
		const seed = productId * 12345; // Use product ID as seed for consistency
		const trendValue = (seed % 100) > 50 ? 'up' : 'down';
		const percentage = (seed % 50) + 1;
		return { trend: trendValue, percentage };
	};

	// Sort products
	const sortedProducts = useMemo(() => {
		const sorted = [...products];
		
		sorted.sort((a, b) => {
			let aValue: any;
			let bValue: any;
			
			switch (sortField) {
				case 'rank':
					aValue = products.indexOf(a);
					bValue = products.indexOf(b);
					break;
				case 'name':
					aValue = a.product?.name?.toLowerCase() || '';
					bValue = b.product?.name?.toLowerCase() || '';
					break;
				case 'sold':
					aValue = a.total_quantity;
					bValue = b.total_quantity;
					break;
				case 'revenue':
					aValue = a.total_revenue;
					bValue = b.total_revenue;
					break;
				case 'trend':
					const trendA = getTrendData(a.product_id);
					const trendB = getTrendData(b.product_id);
					// Sort by trend direction first (up > down), then by percentage
					if (trendA.trend !== trendB.trend) {
						aValue = trendA.trend === 'up' ? 1 : 0;
						bValue = trendB.trend === 'up' ? 1 : 0;
					} else {
						aValue = trendA.percentage;
						bValue = trendB.percentage;
					}
					break;
				default:
					return 0;
			}
			
			if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
		
		return sorted;
	}, [products, sortField, sortDirection]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	const getSortIcon = (field: SortField) => {
		if (sortField !== field) {
			return <HiChevronUp className="w-3 h-3 text-gray-300 opacity-50" />;
		}
		return sortDirection === 'asc' 
			? <HiChevronUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
			: <HiChevronDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />;
	};

	const getSortButtonClass = (field: SortField) => {
		const baseClass = "flex items-center space-x-1 text-xs font-medium uppercase tracking-wider transition-colors";
		
		if (sortField === field) {
			return `${baseClass} text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300`;
		}
		
		return `${baseClass} text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200`;
	};

	return (
		<>
			<style>{scrollbarStyles}</style>
			<div className="overflow-x-auto thin-scrollbar">
			<table className="w-full">
				<thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
					<tr className="border-b border-gray-200 dark:border-gray-700">
						<th className="text-left py-3 px-3">
							<button
								onClick={() => handleSort('rank')}
								className={getSortButtonClass('rank')}
							>
								<span>#</span>
								{getSortIcon('rank')}
							</button>
						</th>
						<th className="text-left py-3 px-3">
							<button
								onClick={() => handleSort('name')}
								className={getSortButtonClass('name')}
							>
								<span>Product</span>
								{getSortIcon('name')}
							</button>
						</th>
						<th className="text-center py-3 px-3 hidden sm:table-cell">
							<button
								onClick={() => handleSort('sold')}
								className={`${getSortButtonClass('sold')} justify-center w-full`}
							>
								<span>Sold</span>
								{getSortIcon('sold')}
							</button>
						</th>
						<th className="text-right py-3 px-3">
							<button
								onClick={() => handleSort('revenue')}
								className={`${getSortButtonClass('revenue')} justify-end w-full`}
							>
								<span>Revenue</span>
								{getSortIcon('revenue')}
							</button>
						</th>
						{showTrend && (
							<th className="text-center py-3 px-3 hidden md:table-cell">
								<button
									onClick={() => handleSort('trend')}
									className={`${getSortButtonClass('trend')} justify-center w-full`}
								>
									<span>Trend</span>
									{getSortIcon('trend')}
								</button>
							</th>
						)}
						<th className="text-center py-3 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
							<span className="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
					{sortedProducts.map((product, index) => {
						const trendData = getTrendData(product.product_id);
						const originalIndex = products.findIndex(p => p.product_id === product.product_id);
						
						return (
							<tr 
								key={product.product_id} 
								className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
							>
								{/* Rank */}
								<td className="py-3 px-3">
									<span className={`
										inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
										${sortField === 'rank' ? 
											((originalIndex === 0) ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 
											 (originalIndex === 1) ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 
											 (originalIndex === 2) ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
											 'text-gray-500 dark:text-gray-400') :
											'text-gray-500 dark:text-gray-400'
										}
									`}>
										{sortField === 'rank' ? originalIndex + 1 : index + 1}
									</span>
								</td>

								{/* Product */}
								<td className="py-3 px-3">
									<Link 
										to={`/products/${product.product.id}`}
										className="flex items-center space-x-2 group"
									>
										<div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden">
											{product.product?.thumbnail ? (
												<img
													src={product.product.thumbnail}
													alt={product.product?.name || "Product"}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
													<svg className="w-4 h-4 text-blue-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
														<path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2H4zm16 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM7 10l2.5 3L12 9.5 17 16H5l2-6z" clipRule="evenodd" />
													</svg>
												</div>
											)}
										</div>
										<div className="min-w-0 flex-1">
											<p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
												{product.product?.name}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
												{formatNumber(product.total_quantity)} sold
											</p>
										</div>
									</Link>
								</td>

								{/* Sold */}
								<td className="py-3 px-3 text-center hidden sm:table-cell">
									<div className="text-sm font-semibold text-gray-900 dark:text-white">
										{formatNumber(product.total_quantity)}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										units
									</div>
								</td>

								{/* Revenue */}
								<td className="py-3 px-3 text-right">
									<div className="text-sm font-bold text-gray-900 dark:text-white">
										{formatCurrency(product.total_revenue)}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										{(product as any).order_count || 0} orders
									</div>
								</td>

								{/* Trend */}
								{showTrend && (
									<td className="py-3 px-3 text-center hidden md:table-cell">
										<div className="inline-flex items-center space-x-1">
											{trendData.trend === 'up' ? (
												<>
													<HiTrendingUp className="w-4 h-4 text-green-500" />
													<span className="text-xs font-medium text-green-600">
														+{trendData.percentage}%
													</span>
												</>
											) : (
												<>
													<HiTrendingDown className="w-4 h-4 text-red-500" />
													<span className="text-xs font-medium text-red-600">
														-{trendData.percentage}%
													</span>
												</>
											)}
										</div>
									</td>
								)}

								{/* Action */}
								<td className="py-3 px-3 text-center">
									<Link
										to={`/products/${product.product.id}`}
										className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
									>
										<HiArrowRight className="w-4 h-4" />
										<span className="sr-only">View product</span>
									</Link>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			</div>
		</>
	);
};

export default ProductTable;