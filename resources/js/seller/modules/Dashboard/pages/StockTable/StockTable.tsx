import useProductStockHistory from '@seller/_hooks/useProductStockHistory';
import { DataTable } from "@seller/components";
import CustomDateModal, { CustomDateRange } from "@seller/components/DatePicker/CustomDateModal";
import { Badge, Dropdown, Table } from 'flowbite-react';
import { useMemo, useState } from 'react';
import { BsClockHistory } from 'react-icons/bs';
import { Link } from 'react-router-dom';

type TimeRangeType = 'today' | 'week' | 'month' | 'year' | 'custom';

const StockTable = ({ className }: { className?: string }) => {
	const [timeRange, setTimeRange] = useState<TimeRangeType>('week');
	const [customRange, setCustomRange] = useState<CustomDateRange>();
	const [showCustomModal, setShowCustomModal] = useState(false);

	const { histories, isLoading, isError } = useProductStockHistory({
		range: timeRange,
		customDateRange: customRange,
	});

	const timeRangeOptions = useMemo(
		() => [
			{ label: 'Today', value: 'today' as TimeRangeType },
			{ label: '7 Days', value: 'week' as TimeRangeType },
			{ label: '30 Days', value: 'month' as TimeRangeType },
			{ label: '1 Year', value: 'year' as TimeRangeType },
			{ label: 'Custom', value: 'custom' as TimeRangeType },
		],
		[]
	);

	const handleTimeRangeChange = (newRange: TimeRangeType) => {
		if (newRange === 'custom') {
			setShowCustomModal(true);
		} else {
			setTimeRange(newRange);
			setCustomRange(undefined);
		}
	};

	const handleCustomDateApply = (customDateRange: CustomDateRange) => {
		setCustomRange(customDateRange);
		setTimeRange('custom');
		setShowCustomModal(false);
	};

	const currentRangeOption = useMemo(() => {
		if (
			timeRange === 'custom' &&
			customRange?.startDate &&
			customRange?.endDate
		) {
			const start = new Date(customRange.startDate);
			const end = new Date(customRange.endDate);

			if (isNaN(start.getTime()) || isNaN(end.getTime())) {
				return { label: 'Custom Range', value: 'custom' };
			}

			const startLabel = start.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});

			if (customRange.startDate === customRange.endDate) {
				return { label: startLabel, value: 'custom' };
			}

			const endLabel = end.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined,
			});

			return { label: `${startLabel} - ${endLabel}`, value: 'custom' };
		}

		return (
			timeRangeOptions.find((option) => option.value === timeRange) ||
			timeRangeOptions[0]
		);
	}, [timeRange, customRange, timeRangeOptions]);

	const getBadgeColor = (
		type: string
	): 'success' | 'failure' | 'warning' | 'gray' => {
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

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center p-8">
				<p className="text-red-500">Failed to load stock history data</p>
			</div>
		);
	}

	return (
		<div
			className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${className}`}
		>
			{/* Minimal Header */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-2">
					<BsClockHistory className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<h3 className="text-base font-medium text-gray-900 dark:text-white">
						Product Stock History
					</h3>
				</div>
			</div>
			<DataTable
				columns={[
					{
						label: 'Product',
						key: 'product',
                        sortable: true,
						render: (row: any) => (
							<Table.Cell className="p-4 text-sm font-normal whitespace-nowrap text-gray-900 dark:text-white">
								<div className="flex gap-2.5 items-start">
									<div className="w-8 h-8 rounded-full object-center overflow-hidden aspect-square">
										{row.product?.thumbnail ? (
											<img
												className="w-full h-full object-cover"
												src={row.product.thumbnail}
												alt="Product Image"
											/>
										) : (
											<div className="w-full h-full object-cover bg-gray-300"></div>
										)}
									</div>
									<div>
										<Link
											to={`/products/${row.product_id}`}
											target="_blank"
											className="text-black hover:text-primary transition-all duration-300 font-medium"
										>
											{row.product?.name || 'Unknown Product'}
										</Link>
										{row.product && (
											<p className="text-xs">
												<span className="text-red-400">
													Buying Value {row.product.stockBuyingValue || 0} TK
												</span>{' '}
												-{' '}
												<span className="text-green-400">
													Selling Value {row.product.stockValue || 0} TK
												</span>
											</p>
										)}
									</div>
								</div>
							</Table.Cell>
						),
					},
					{
						label: 'Quantity',
						key: 'qty',
						render: (row: any) => (
							<Table.Cell className="p-4 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
								{row.qty}
							</Table.Cell>
						),
						sortable: true,
					},
					{
						label: 'Type',
						key: 'type',
						render: (row: any) => (
							<Table.Cell className="p-4 whitespace-nowrap">
								<Badge
									className="rounded-md font-medium uppercase"
									color={getBadgeColor(row.type)}
								>
									{row.type}
								</Badge>
							</Table.Cell>
						),
						sortable: true,
					},
					{
						label: 'Price',
						key: 'price',
						render: (row: any) => (
							<Table.Cell className="p-4 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
								{row.price} TK
							</Table.Cell>
						),
						sortable: true,
					},
					{
						label: 'Created',
						key: 'created_at',
						render: (row: any) => (
							<Table.Cell className="p-4 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
								{row.created_at}
							</Table.Cell>
						),
						sortable: true,
					},
				]}
				search={{
					placeholder: 'Search stock history...',
					columns: ['product.name', 'type', 'created_at'],
				}}
				data={histories || []}
				head={{
					render: () => (
						<div className="flex items-center gap-4">
							<Dropdown
								label={currentRangeOption?.label ?? ''}
								color="gray"
								size="sm"
							>
								{timeRangeOptions.map((option) => (
									<Dropdown.Item
										key={option.value}
										onClick={() => handleTimeRangeChange(option.value)}
										className={
											timeRange === option.value
												? 'bg-blue-50 dark:bg-blue-900'
												: ''
										}
									>
										{option.label}
									</Dropdown.Item>
								))}
							</Dropdown>
						</div>
					),
				}}
				exportable={true}
				filename="stock_history"
			/>

			{/* Custom Date Range Modal */}
			<CustomDateModal
				isOpen={showCustomModal}
				onClose={() => setShowCustomModal(false)}
				onApply={handleCustomDateApply}
				currentRange={customRange}
			/>
		</div>
	);
};

export default StockTable;
