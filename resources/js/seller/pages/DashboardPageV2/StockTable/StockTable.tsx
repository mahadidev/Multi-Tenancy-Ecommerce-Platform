import useProductStockHistory from '@seller/hooks/useProductStockHistory';
import { ProductStockHistoryType } from '@type/productType';
import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, Spinner, Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import CustomDateModal, { CustomDateRange } from '../../../components/DatePicker/CustomDateModal';
import DataTablePagination from '../../../components/DataTable/DataTablePagination';

type TimeRangeType = 'today' | 'week' | 'month' | 'year' | 'custom';

const StockTable = () => {
	const [timeRange, setTimeRange] = useState<TimeRangeType>('week');
	const [customRange, setCustomRange] = useState<CustomDateRange>();
	const [showCustomModal, setShowCustomModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const { histories, meta, isLoading, isError, error, isFallback, refetch } = useProductStockHistory({
		range: timeRange,
		customDateRange: customRange,
		limit: 10, // Start with small limit to prevent timeouts
		page: currentPage,
	});

	const timeRangeOptions = [
		{ label: 'Today', value: 'today' as TimeRangeType },
		{ label: '7 Days', value: 'week' as TimeRangeType },
		{ label: '30 Days', value: 'month' as TimeRangeType },
		{ label: '1 Year', value: 'year' as TimeRangeType },
		{ label: 'Custom', value: 'custom' as TimeRangeType },
	];

	const handleTimeRangeChange = (newRange: TimeRangeType) => {
		if (newRange === 'custom') {
			setShowCustomModal(true);
		} else {
			setTimeRange(newRange);
			setCustomRange(undefined);
			setCurrentPage(1); // Reset to first page when changing time range
		}
	};

	const handleCustomDateApply = (customDateRange: CustomDateRange) => {
		setCustomRange(customDateRange);
		setTimeRange('custom');
		setCurrentPage(1);
		setShowCustomModal(false);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const currentRangeOption = useMemo(() => {
		if (timeRange === 'custom' && customRange?.startDate && customRange?.endDate) {
			const start = new Date(customRange.startDate);
			const end = new Date(customRange.endDate);
			
			if (isNaN(start.getTime()) || isNaN(end.getTime())) {
				return { label: 'Custom Range', value: 'custom' };
			}
			
			const startLabel = start.toLocaleDateString('en-US', { 
				month: 'short', 
				day: 'numeric',
				year: 'numeric'
			});
			
			if (customRange.startDate === customRange.endDate) {
				return { label: startLabel, value: 'custom' };
			}
			
			const endLabel = end.toLocaleDateString('en-US', { 
				month: 'short', 
				day: 'numeric',
				year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
			});
			
			return { label: `${startLabel} - ${endLabel}`, value: 'custom' };
		}
		
		return timeRangeOptions.find(option => option.value === timeRange) || timeRangeOptions[1];
	}, [timeRange, customRange, timeRangeOptions]);

    const getBadgeColor = (type: string) => {
			switch (type) {
				case 'added':
					return 'success';
				case 'deleted':
					return 'failure';
				case 'adjusted':
					return 'warning';
				default:
					return 'gray';
			}
		};

	return (
		<>
			<div className="col-span-full rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
							Stock History
						</h3>
						<span className="text-base font-normal text-gray-600 dark:text-gray-400">
							This is a list of latest stock history
						</span>
					</div>
					<div className="shrink-0">
						<Dropdown
							key={`${timeRange}-${customRange?.startDate}-${customRange?.endDate}`}
							label={currentRangeOption.label}
							color="gray"
							size="sm"
							arrowIcon={HiChevronDown}
						>
							{timeRangeOptions.map((option) => (
								<Dropdown.Item
									key={option.value}
									onClick={() => handleTimeRangeChange(option.value)}
									className={timeRange === option.value ? 'bg-blue-50 dark:bg-blue-900' : ''}
								>
									{option.label}
								</Dropdown.Item>
							))}
						</Dropdown>
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<Spinner size="xl" className="mb-4" />
							<p className="text-gray-500 dark:text-gray-400">Loading stock history...</p>
						</div>
					</div>
				)}

				{/* Fallback notification for mock data */}
				{isFallback && (
					<div className="mt-4">
						<Alert color="warning">
							<div className="flex items-center justify-between">
								<div>
									<span className="font-medium">Backend API issue detected.</span>{' '}
									Showing sample data. Contact your administrator to optimize database queries.
								</div>
								<button 
									onClick={() => refetch()}
									className="ml-4 px-3 py-1 text-sm bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
								>
									Retry
								</button>
							</div>
						</Alert>
					</div>
				)}

				{/* Error State */}
				{isError && (
					<div className="mt-4">
						<Alert color="failure">
							<span className="font-medium">Error loading stock history:</span>{' '}
							{error?.message || 'Failed to load data. The query may be too large or timing out.'}
						</Alert>
					</div>
				)}

				{/* Content */}
				{!isLoading && !isError && (
			<div className="mt-8 flex flex-col">
				<div className="overflow-x-auto rounded-lg">
					<div className="inline-block min-w-full align-middle">
						<div className="overflow-hidden shadow sm:rounded-lg">
							<Table
								striped
								className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
							>
								<TableHead
									className="bg-gray-50 dark:bg-gray-700"
									theme={{
										cell: {
											base: 'p-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white',
										},
									}}
								>
									<TableHeadCell>Product</TableHeadCell>
									<TableHeadCell>Quantity</TableHeadCell>
									<TableHeadCell>Type</TableHeadCell>
									<TableHeadCell>Created</TableHeadCell>
								</TableHead>
								<TableBody className="bg-white dark:bg-gray-800">
									{histories && histories.length > 0 ? (
										histories.map((history: ProductStockHistoryType, index: number) => (
											<TableRow key={`${history.id}-${index}`}>
												<TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-900 dark:text-white flex gap-2.5 items-start">
													<div className="w-8 h-8 rounded-full object-center overflow-hidden aspect-square">
														{history.product.thumbnail ? (
															<img
																className="w-full h-full object-cover"
																src={history.product.thumbnail}
																alt="Product Iamge"
															/>
														) : (
															<div className="w-full h-full object-cover bg-gray-300"></div>
														)}
													</div>
													<div>
														<Link
															to={`/products/${history.product_id}`}
															target="_bank"
															className="text-black hover:text-primary transition-all duration-300 font-medium"
														>
															{history.product.name}
														</Link>
														<p className='text-xs'>
															<span className="text-red-400">
																Buying Value {history.product.stockBuyingValue}{' '}
																TK
															</span>{' '}
															-{' '}
															<span className='text-green-400'>
																Selling Value {history.product.stockValue} TK
															</span>
														</p>
													</div>
												</TableCell>
												<TableCell className="p-4 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
													{history.qty}
												</TableCell>
												<TableCell className="flex p-4 whitespace-nowrap">
													<Badge
														className="rounded-md font-medium uppercase"
														color={getBadgeColor(history.type)}
													>
														{history.type}
													</Badge>
												</TableCell>
												<TableCell className="p-4 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
													{history.created_at}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={4} className="text-center py-8">
												<div className="text-gray-500 dark:text-gray-400">
													No stock history found for the selected period.
												</div>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>

				{/* Pagination Controls */}
				{!isLoading && !isError && meta && meta.last_page > 1 && (
					<DataTablePagination
						currentPage={currentPage}
						totalPages={meta.last_page}
						onPageChange={handlePageChange}
					/>
				)}
			</div>
			)} {/* End of content conditional */}
			</div>

			{/* Custom Date Range Modal */}
			<CustomDateModal
				isOpen={showCustomModal}
				onClose={() => setShowCustomModal(false)}
				onApply={handleCustomDateApply}
				currentRange={customRange}
			/>
		</>
	);
};
export default StockTable;
