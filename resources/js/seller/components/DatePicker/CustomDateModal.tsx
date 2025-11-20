import { FC, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { HiCalendar } from 'react-icons/hi';

export interface CustomDateRange {
	startDate: string;
	endDate: string;
}

interface CustomDateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onApply: (dateRange: CustomDateRange) => void;
	currentRange?: CustomDateRange;
}

const CustomDateModal: FC<CustomDateModalProps> = ({
	isOpen,
	onClose,
	onApply,
	currentRange
}) => {
	const [startDate, setStartDate] = useState(currentRange?.startDate || '');
	const [endDate, setEndDate] = useState(currentRange?.endDate || '');

	const handleApply = () => {
		if (!startDate || !endDate) {
			alert('Please select both start and end dates');
			return;
		}

		if (new Date(startDate) > new Date(endDate)) {
			alert('Start date cannot be after end date');
			return;
		}

		onApply({ startDate, endDate });
	};

	const handleClose = () => {
		// Reset to current range or clear
		setStartDate(currentRange?.startDate || '');
		setEndDate(currentRange?.endDate || '');
		onClose();
	};

	const getMaxDate = () => {
		return new Date().toISOString().split('T')[0];
	};

	const getMinDate = () => {
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 2);
		return oneYearAgo.toISOString().split('T')[0];
	};

	const formatCustomRangeLabel = () => {
		if (!startDate || !endDate) return '';
		
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

	return (
		<Modal show={isOpen} onClose={handleClose} size="md">
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
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							min={getMinDate()}
							max={endDate || getMaxDate()}
							className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							End Date
						</label>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							min={startDate || getMinDate()}
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
										
										setEndDate(end.toISOString().split('T')[0] || '');
										setStartDate(start.toISOString().split('T')[0] || '');
									}}
									className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
								>
									{option.label}
								</button>
							))}
						</div>
					</div>

					{startDate && endDate && (
						<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
							<div className="text-sm text-blue-800 dark:text-blue-400">
								<strong>Selected Range:</strong> {formatCustomRangeLabel()}
							</div>
							<div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
								{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
							</div>
						</div>
					)}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<div className="flex items-center justify-end space-x-2 w-full">
					<Button
						color="gray"
						onClick={handleClose}
					>
						Cancel
					</Button>
					<Button
						onClick={handleApply}
						disabled={!startDate || !endDate}
						className="bg-blue-600 hover:bg-blue-700 text-white border-0"
					>
						Apply Date Range
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};

export default CustomDateModal;