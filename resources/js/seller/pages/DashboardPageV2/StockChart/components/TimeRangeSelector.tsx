import { FC } from 'react';
import { Button } from 'flowbite-react';
import { HiClock } from 'react-icons/hi';

type TimeRangeType = 'today' | 'week' | 'month' | 'year';

interface TimeRangeSelectorProps {
	currentRange: TimeRangeType;
	onRangeChange: (range: TimeRangeType) => void;
}

const TimeRangeSelector: FC<TimeRangeSelectorProps> = ({
	currentRange,
	onRangeChange
}) => {
	const timeRanges: { value: TimeRangeType; label: string }[] = [
		{ value: 'today', label: 'Today' },
		{ value: 'week', label: '7 Days' },
		{ value: 'month', label: '30 Days' },
		{ value: 'year', label: '1 Year' }
	];

	return (
		<div className="flex items-center space-x-2">
			<HiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
			<span className="text-sm text-gray-600 dark:text-gray-400">Time Range:</span>
			<div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
				{timeRanges.map((range) => (
					<button
						key={range.value}
						onClick={() => onRangeChange(range.value)}
						className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
							currentRange === range.value
								? 'bg-blue-600 text-white shadow-sm'
								: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
						}`}
					>
						{range.label}
					</button>
				))}
			</div>
		</div>
	);
};

export default TimeRangeSelector;