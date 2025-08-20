import { FC, useState, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import { HiCalendar, HiX } from 'react-icons/hi';

export type TimeRangeType = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface CustomDateRange {
	startDate: string;
	endDate: string;
}

interface CustomDateRangeSelectorProps {
	currentRange: TimeRangeType;
	onRangeChange: (range: TimeRangeType, customRange?: CustomDateRange) => void;
	customRange?: CustomDateRange;
	className?: string;
}

const CustomDateRangeSelector: FC<CustomDateRangeSelectorProps> = ({
	currentRange,
	onRangeChange,
	customRange,
	className = ''
}) => {
	const [showModal, setShowModal] = useState(false);
	const [startDate, setStartDate] = useState(customRange?.startDate || '');
	const [endDate, setEndDate] = useState(customRange?.endDate || '');
	const [tempStartDate, setTempStartDate] = useState('');
	const [tempEndDate, setTempEndDate] = useState('');

	const timeRanges: { value: TimeRangeType; label: string }[] = [
		{ value: 'today', label: 'Today' },
		{ value: 'week', label: '7 Days' },
		{ value: 'month', label: '30 Days' },
		{ value: 'year', label: '1 Year' },
		{ value: 'custom', label: 'Custom' }
	];

	// Update local state when customRange prop changes
	useEffect(() => {
		if (customRange) {
			setStartDate(customRange.startDate);
			setEndDate(customRange.endDate);
		}
	}, [customRange]);

	const handleRangeClick = (range: TimeRangeType) => {
		if (range === 'custom') {
			setTempStartDate(startDate);
			setTempEndDate(endDate);
			setShowModal(true);
		} else {
			onRangeChange(range);
		}
	};

	const handleCustomDateApply = () => {
		if (!tempStartDate || !tempEndDate) {
			alert('Please select both start and end dates');
			return;
		}

		if (new Date(tempStartDate) > new Date(tempEndDate)) {
			alert('Start date cannot be after end date');
			return;
		}

		const customDateRange: CustomDateRange = {
			startDate: tempStartDate,
			endDate: tempEndDate
		};

		setStartDate(tempStartDate);
		setEndDate(tempEndDate);
		setShowModal(false);
		onRangeChange('custom', customDateRange);
	};

	const handleModalClose = () => {
		setTempStartDate(startDate);
		setTempEndDate(endDate);
		setShowModal(false);
	};

	const formatCustomRangeLabel = () => {
		if (!startDate || !endDate) return 'Custom';
		
		const start = new Date(startDate);
		const end = new Date(endDate);
		
		const startLabel = start.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric' 
		});
		const endLabel = end.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
		});
		
		return `${startLabel} - ${endLabel}`;
	};

	const getMaxDate = () => {
		return new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
	};

	const getMinDate = () => {
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 2);
		return oneYearAgo.toISOString().split('T')[0];
	};

	return (
		<>
			<div className={`flex items-center space-x-2 ${className}`}>
				<HiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
				<span className="text-sm text-gray-600 dark:text-gray-400">Period:</span>
				<div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
					{timeRanges.map((range) => (
						<button
							key={range.value}
							onClick={() => handleRangeClick(range.value)}
							className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
								currentRange === range.value
									? 'bg-blue-600 text-white shadow-sm'
									: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
							}`}
							title={range.value === 'custom' && currentRange === 'custom' ? formatCustomRangeLabel() : range.label}
						>
							{range.value === 'custom' && currentRange === 'custom' 
								? formatCustomRangeLabel() 
								: range.label
							}
						</button>
					))}
				</div>
			</div>

			{/* Custom Date Range Modal */}
			<Modal show={showModal} onClose={handleModalClose} size="md">
				<Modal.Header>
					<div className="flex items-center space-x-2">
						<HiCalendar className="w-5 h-5 text-blue-600" />
						<span>Select Custom Date Range</span>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Start Date
							</label>
							<input
								type="date"
								value={tempStartDate}
								onChange={(e) => setTempStartDate(e.target.value)}
								min={getMinDate()}
								max={tempEndDate || getMaxDate()}
								className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								End Date
							</label>
							<input
								type="date"
								value={tempEndDate}
								onChange={(e) => setTempEndDate(e.target.value)}
								min={tempStartDate || getMinDate()}
								max={getMaxDate()}
								className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						
						{/* Quick Select Options */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Quick Select
							</label>
							<div className="grid grid-cols-2 gap-2">
								{[
									{ label: 'Last 7 Days', days: 7 },
									{ label: 'Last 14 Days', days: 14 },
									{ label: 'Last 30 Days', days: 30 },
									{ label: 'Last 90 Days', days: 90 }
								].map((option) => (
									<button
										key={option.days}
										onClick={() => {
											const end = new Date();
											const start = new Date();
											start.setDate(start.getDate() - option.days);
											
											setTempEndDate(end.toISOString().split('T')[0]);
											setTempStartDate(start.toISOString().split('T')[0]);
										}}
										className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
									>
										{option.label}
									</button>
								))}
							</div>
						</div>

						{tempStartDate && tempEndDate && (
							<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
								<div className="text-sm text-blue-800 dark:text-blue-400">
									<strong>Selected Range:</strong> {formatCustomRangeLabel()}
								</div>
								<div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
									{Math.ceil((new Date(tempEndDate).getTime() - new Date(tempStartDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
								</div>
							</div>
						)}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<div className="flex items-center justify-end space-x-2 w-full">
						<Button
							color="gray"
							onClick={handleModalClose}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCustomDateApply}
							disabled={!tempStartDate || !tempEndDate}
							className="bg-blue-600 hover:bg-blue-700 text-white border-0"
						>
							Apply Date Range
						</Button>
					</div>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default CustomDateRangeSelector;