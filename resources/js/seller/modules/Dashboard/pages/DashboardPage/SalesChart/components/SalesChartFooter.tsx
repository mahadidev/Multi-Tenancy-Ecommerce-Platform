import { FC } from 'react';
import { SalesChartFooterProps } from '../types';
import DateRangeDropdown from './DateRangeDropdown';

const SalesChartFooter: FC<SalesChartFooterProps> = ({
	currentRange,
	rangeList,
	onRangeChange,
	isLoading
}) => {
	return (
		<div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 relative">
			<DateRangeDropdown
				currentValue={currentRange}
				onChange={onRangeChange}
				list={rangeList}
				isLoading={isLoading}
			/>

			<div className="text-xs text-gray-500 dark:text-gray-400">
				Updated {new Date().toLocaleTimeString()}
			</div>
		</div>
	);
};

export default SalesChartFooter;
