import { FC } from 'react';
import { Button } from 'flowbite-react';
import { HiChevronUp, HiChevronDown, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

interface StockData {
	id: number;
	date: string;
	buyingValue: number;
	sellingValue: number;
	quantity: number;
	profit: number;
	profitMargin: string;
	trend: 'up' | 'down';
}

interface Category {
	id: number;
	name: string;
	slug: string;
}

interface StockReportTableProps {
	data: StockData[];
	sortConfig: { field: string; direction: 'asc' | 'desc' };
	onSort: (field: string) => void;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	categories?: Category[];
}

const StockReportTable: FC<StockReportTableProps> = ({
	data,
	sortConfig,
	onSort,
	currentPage,
	totalPages,
	onPageChange,
	categories = []
}) => {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0
		}).format(amount).replace('BDT', '৳');
	};

	const getSortIcon = (field: string) => {
		if (sortConfig.field !== field) {
			return <HiChevronUp className="w-4 h-4 text-gray-300 opacity-50" />;
		}
		return sortConfig.direction === 'asc' 
			? <HiChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
			: <HiChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
	};

	const getSortButtonClass = (field: string) => {
		const baseClass = "flex items-center space-x-1 text-xs font-medium uppercase tracking-wider transition-colors hover:text-gray-800 dark:hover:text-gray-200";
		
		if (sortConfig.field === field) {
			return `${baseClass} text-blue-600 dark:text-blue-400`;
		}
		
		return `${baseClass} text-gray-600 dark:text-gray-400`;
	};

	const columns = [
		{ key: 'date', label: 'Date', sortable: true },
		{ key: 'category', label: 'Category', sortable: false },
		{ key: 'buyingValue', label: 'Buying Value', sortable: true },
		{ key: 'sellingValue', label: 'Selling Value', sortable: true },
		{ key: 'quantity', label: 'Quantity', sortable: true },
		{ key: 'profit', label: 'Profit', sortable: true },
		{ key: 'profitMargin', label: 'Profit Margin', sortable: true },
		{ key: 'trend', label: 'Trend', sortable: false }
	];

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
			{/* Table Header */}
			<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Stock Data Table
				</h3>
				<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
					Detailed view of all stock transactions and metrics
				</p>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 dark:bg-gray-800/50">
						<tr>
							{columns.map((column) => (
								<th key={column.key} className="text-left py-3 px-6">
									{column.sortable ? (
										<button
											onClick={() => onSort(column.key)}
											className={getSortButtonClass(column.key)}
										>
											<span>{column.label}</span>
											{getSortIcon(column.key)}
										</button>
									) : (
										<span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
											{column.label}
										</span>
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{data.map((row, index) => {
							// Simulate category assignment based on index
							const simulatedCategoryId = (index % (categories.length || 1)) + 1;
							const assignedCategory = categories.find(c => c.id === simulatedCategoryId);
							
							return (
								<tr
									key={row.id}
									className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
								>
									<td className="py-4 px-6">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{(() => {
												// Check if it's a valid date format (YYYY-MM-DD)
												if (row.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
													const date = new Date(row.date);
													return date.toLocaleDateString('en-US', {
														year: 'numeric',
														month: 'short',
														day: 'numeric'
													});
												}
												
												// Check if it's a month format (e.g., "Jan 2024")
												if (row.date.match(/^[A-Za-z]{3}\s\d{4}$/)) {
													return row.date;
												}
												
												// Check if it's a day format (e.g., "Mon, Jan 15")
												if (row.date.includes(',')) {
													return row.date;
												}
												
												// For time format (e.g., "14:00") or other formats
												return row.date;
											})()}
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center">
											{assignedCategory ? (
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
													{assignedCategory.name}
												</span>
											) : (
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
													General
												</span>
											)}
										</div>
									</td>
								<td className="py-4 px-6">
									<div className="text-sm font-medium text-gray-900 dark:text-white">
										{formatCurrency(row.buyingValue)}
									</div>
								</td>
								<td className="py-4 px-6">
									<div className="text-sm font-medium text-gray-900 dark:text-white">
										{formatCurrency(row.sellingValue)}
									</div>
								</td>
								<td className="py-4 px-6">
									<div className="text-sm font-medium text-gray-900 dark:text-white">
										{row.quantity.toLocaleString()}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										items
									</div>
								</td>
								<td className="py-4 px-6">
									<div className={`text-sm font-medium ${
										row.profit >= 0 
											? 'text-green-600 dark:text-green-400' 
											: 'text-red-600 dark:text-red-400'
									}`}>
										{formatCurrency(row.profit)}
									</div>
								</td>
								<td className="py-4 px-6">
									<div className={`text-sm font-medium ${
										parseFloat(row.profitMargin) >= 0 
											? 'text-green-600 dark:text-green-400' 
											: 'text-red-600 dark:text-red-400'
									}`}>
										{row.profitMargin}%
									</div>
								</td>
								<td className="py-4 px-6">
									<div className={`inline-flex items-center space-x-1 ${
										row.trend === 'up' 
											? 'text-green-600 dark:text-green-400' 
											: 'text-red-600 dark:text-red-400'
									}`}>
										{row.trend === 'up' ? (
											<HiTrendingUp className="w-4 h-4" />
										) : (
											<HiTrendingDown className="w-4 h-4" />
										)}
										<span className="text-xs font-medium capitalize">
											{row.trend}
										</span>
									</div>
								</td>
							</tr>
						);
						})}
					</tbody>
				</table>

				{/* Empty State */}
				{data.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-400 dark:text-gray-500 mb-4">
							<svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
							No data found
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Try adjusting your filters or time range to see results.
						</p>
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-700 dark:text-gray-300">
							Page {currentPage} of {totalPages}
						</div>
						<div className="flex items-center space-x-2">
							<Button
								size="sm"
								disabled={currentPage === 1}
								onClick={() => onPageChange(currentPage - 1)}
								color="gray"
							>
								Previous
							</Button>
							<div className="flex items-center space-x-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
									if (pageNum > totalPages) return null;
									return (
										<button
											key={pageNum}
											onClick={() => onPageChange(pageNum)}
											className={`px-3 py-1 text-sm rounded-md ${
												currentPage === pageNum
													? 'bg-blue-600 text-white'
													: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
											}`}
										>
											{pageNum}
										</button>
									);
								})}
							</div>
							<Button
								size="sm"
								disabled={currentPage === totalPages}
								onClick={() => onPageChange(currentPage + 1)}
								color="gray"
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default StockReportTable;