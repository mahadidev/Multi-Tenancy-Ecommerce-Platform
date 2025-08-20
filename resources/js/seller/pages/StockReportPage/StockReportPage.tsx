import { FC, useState, useMemo } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { 
	HiChartPie, 
	HiDownload, 
	HiFilter, 
	HiRefresh, 
	HiViewGrid,
	HiViewList,
	HiSearch,
	HiCalendar,
	HiTrendingUp,
	HiTrendingDown
} from 'react-icons/hi';
import useProduct from '@seller/hooks/useProduct';
import useCategory from '@seller/hooks/useCategory';
import { 
	StockReportHeader,
	StockReportFilters,
	StockReportTable,
	StockReportCharts,
	StockReportStats,
	ExportModal
} from './components';

type TimeRangeType = 'today' | 'week' | 'month' | 'year';
type ViewModeType = 'table' | 'cards' | 'charts';

interface StockReportPageProps {
	className?: string;
}

const StockReportPage: FC<StockReportPageProps> = ({ className = '' }) => {
	// State management
	const [timeRange, setTimeRange] = useState<TimeRangeType>('month');
	const [viewMode, setViewMode] = useState<ViewModeType>('table');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [sortConfig, setSortConfig] = useState<{field: string; direction: 'asc' | 'desc'}>({
		field: 'buyingValue',
		direction: 'desc'
	});
	const [showExportModal, setShowExportModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(25);

	// Data fetching
	const { summary: productReport } = useProduct({ summaryFilterRange: timeRange });
	const { productCategories, categoriesMeta } = useCategory();

	// Helper function to format dates based on time range
	const formatDateLabel = (dateKey: string, index: number, timeRange: TimeRangeType): string => {
		// Log for debugging (remove in production)
		console.log('Date key:', dateKey, 'Time range:', timeRange);
		
		// If it's already a formatted date string, use it
		if (dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
			return dateKey;
		}
		
		// Try parsing as date
		const parsedDate = new Date(dateKey);
		if (!isNaN(parsedDate.getTime())) {
			return parsedDate.toISOString().split('T')[0];
		}
		
		// Generate meaningful labels based on time range
		const now = new Date();
		switch (timeRange) {
			case 'today':
				// For today, use hours
				return `${String(index).padStart(2, '0')}:00`;
			case 'week':
				// For week, use day names
				const daysAgo = 6 - index;
				const dayDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
				return dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
			case 'month':
				// For month, use dates
				const monthDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (29 - index));
				return monthDate.toISOString().split('T')[0];
			case 'year':
				// For year, use months
				const yearDate = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
				return yearDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
			default:
				return dateKey.includes('-') ? dateKey : `Period ${index + 1}`;
		}
	};

	// Processed data
	const processedData = useMemo(() => {
		if (!productReport?.chartSeries) return [];
		
		const entries = Object.entries(productReport.chartSeries);
		return entries.map(([dateKey, data]: [string, any], index) => {
			const formattedDate = formatDateLabel(dateKey, index, timeRange);
			
			return {
				id: index + 1,
				date: formattedDate,
				originalKey: dateKey, // Keep original for debugging
				buyingValue: data?.buyingValue || 0,
				sellingValue: data?.sellingValue || 0,
				quantity: data?.qty || 0,
				profit: (data?.sellingValue || 0) - (data?.buyingValue || 0),
				profitMargin: data?.sellingValue ? 
					(((data?.sellingValue - data?.buyingValue) / data?.sellingValue) * 100).toFixed(2) : 0,
				trend: Math.random() > 0.5 ? 'up' : 'down' // Simulated trend
			};
		});
	}, [productReport, timeRange]);

	// Filtered and sorted data
	const filteredData = useMemo(() => {
		let filtered = processedData;

		// Search filter
		if (searchQuery) {
			filtered = filtered.filter(item => 
				item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.originalKey.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Category filter (simulated - in real implementation, this would filter based on product categories)
		if (selectedCategories.length > 0) {
			// For demonstration, we'll simulate filtering by randomly assigning categories to data
			filtered = filtered.filter((item, index) => {
				// Simulate category assignment based on index
				const simulatedCategoryId = (index % (productCategories?.length || 1)) + 1;
				return selectedCategories.includes(simulatedCategoryId.toString());
			});
		}

		// Sort
		filtered.sort((a, b) => {
			const aVal = a[sortConfig.field as keyof typeof a] as number;
			const bVal = b[sortConfig.field as keyof typeof b] as number;
			
			if (sortConfig.direction === 'asc') {
				return aVal - bVal;
			}
			return bVal - aVal;
		});

		return filtered;
	}, [processedData, searchQuery, selectedCategories, sortConfig, productCategories]);

	// Pagination
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredData.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredData, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	// Handlers
	const handleTimeRangeChange = (range: TimeRangeType) => {
		setTimeRange(range);
		setCurrentPage(1);
	};

	const handleViewModeChange = (mode: ViewModeType) => {
		setViewMode(mode);
	};

	const handleSort = (field: string) => {
		setSortConfig(prev => ({
			field,
			direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
		}));
		setCurrentPage(1);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
		// Export functionality would be implemented here
		console.log(`Exporting as ${format}`);
		setShowExportModal(false);
	};

	const handleRefresh = () => {
		// Refresh data
		window.location.reload();
	};

	// Loading state
	if (!productReport) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<div className="flex items-center justify-center h-96">
					<div className="text-center">
						<Spinner size="xl" className="mb-4" />
						<p className="text-gray-500 dark:text-gray-400 text-lg">
							Loading stock report...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
			{/* Header */}
			<StockReportHeader
				timeRange={timeRange}
				onTimeRangeChange={handleTimeRangeChange}
				onRefresh={handleRefresh}
				onExport={() => setShowExportModal(true)}
			/>

			{/* Stats Overview */}
			<div className="px-4 sm:px-6 lg:px-8 py-6">
				<StockReportStats 
					data={processedData}
					timeRange={timeRange}
				/>
			</div>

			{/* Filters and Controls */}
			<div className="px-4 sm:px-6 lg:px-8 py-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="p-6">
						<StockReportFilters
							searchQuery={searchQuery}
							onSearchChange={handleSearch}
							selectedCategories={selectedCategories}
							onCategoryChange={setSelectedCategories}
							itemsPerPage={itemsPerPage}
							onItemsPerPageChange={setItemsPerPage}
							categories={productCategories || []}
							isLoadingCategories={!productCategories}
						/>

						{/* View Mode Toggle */}
						<div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
							<div className="flex items-center space-x-2">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									View Mode:
								</span>
								<div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
									{[
										{ mode: 'table' as ViewModeType, icon: HiViewList, label: 'Table' },
										{ mode: 'cards' as ViewModeType, icon: HiViewGrid, label: 'Cards' },
										{ mode: 'charts' as ViewModeType, icon: HiChartPie, label: 'Charts' }
									].map(({ mode, icon: Icon, label }) => (
										<button
											key={mode}
											onClick={() => handleViewModeChange(mode)}
											className={`flex items-center space-x-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
												viewMode === mode
													? 'bg-blue-600 text-white shadow-sm'
													: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
											}`}
										>
											<Icon className="w-4 h-4" />
											<span className="hidden sm:inline">{label}</span>
										</button>
									))}
								</div>
							</div>

							<div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
								<span>
									Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="px-4 sm:px-6 lg:px-8 pb-8">
				{viewMode === 'table' && (
					<StockReportTable
						data={paginatedData}
						sortConfig={sortConfig}
						onSort={handleSort}
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						categories={productCategories || []}
					/>
				)}

				{viewMode === 'charts' && (
					<StockReportCharts
						data={processedData}
						timeRange={timeRange}
					/>
				)}

				{viewMode === 'cards' && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{paginatedData.map((item, index) => {
							// Simulate category assignment based on index
							const simulatedCategoryId = (index % (productCategories?.length || 1)) + 1;
							const assignedCategory = productCategories?.find(c => c.id === simulatedCategoryId);
							
							return (
								<div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
									<div className="flex items-center justify-between mb-4">
										<div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{item.date}
											</h3>
											{assignedCategory && (
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mt-1">
													{assignedCategory.name}
												</span>
											)}
										</div>
										<div className={`flex items-center space-x-1 ${
											item.trend === 'up' ? 'text-green-600' : 'text-red-600'
										}`}>
											{item.trend === 'up' ? (
												<HiTrendingUp className="w-4 h-4" />
											) : (
												<HiTrendingDown className="w-4 h-4" />
											)}
										</div>
									</div>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">Buying Value:</span>
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											৳{item.buyingValue.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">Selling Value:</span>
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											৳{item.sellingValue.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											{item.quantity} items
										</span>
									</div>
									<div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
										<span className="text-sm text-gray-600 dark:text-gray-400">Profit:</span>
										<span className={`text-sm font-medium ${
											item.profit >= 0 ? 'text-green-600' : 'text-red-600'
										}`}>
											৳{item.profit.toLocaleString()}
										</span>
									</div>
								</div>
							</div>
							);
						})}
					</div>
				)}

				{/* Pagination for cards view */}
				{viewMode === 'cards' && totalPages > 1 && (
					<div className="mt-8 flex items-center justify-center">
						<div className="flex items-center space-x-2">
							<Button
								size="sm"
								disabled={currentPage === 1}
								onClick={() => setCurrentPage(prev => prev - 1)}
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
											onClick={() => setCurrentPage(pageNum)}
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
								onClick={() => setCurrentPage(prev => prev + 1)}
								color="gray"
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Export Modal */}
			{showExportModal && (
				<ExportModal
					isOpen={showExportModal}
					onClose={() => setShowExportModal(false)}
					onExport={handleExport}
					data={filteredData}
				/>
			)}
		</div>
	);
};

export default StockReportPage;