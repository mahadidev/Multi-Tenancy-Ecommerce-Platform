import { FC } from 'react';
import { TimeRangeType, TimeRangeOption } from '../types';

interface TimeRangeSelectProps {
	currentTimeRange: TimeRangeOption;
	timeRangeOptions: TimeRangeOption[];
	onTimeRangeChange: (timeRange: TimeRangeType) => void;
	isLoading?: boolean;
}

const TimeRangeSelect: FC<TimeRangeSelectProps> = ({ 
	currentTimeRange, 
	timeRangeOptions, 
	onTimeRangeChange,
	isLoading = false 
}) => {
	return (
		<select
			value={currentTimeRange.value}
			onChange={(e) => onTimeRangeChange(e.target.value as TimeRangeType)}
			disabled={isLoading}
			className={`
				text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5
				bg-white dark:bg-gray-800 text-gray-900 dark:text-white
				focus:ring-2 focus:ring-blue-500 focus:border-blue-500
				${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
			`}
		>
			{timeRangeOptions.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
};

export default TimeRangeSelect;