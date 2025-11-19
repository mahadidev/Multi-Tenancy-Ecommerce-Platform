import CustomDateModal, { CustomDateRange } from '@seller/components/DatePicker/CustomDateModal';
import { useMemo, useState } from 'react';

export type PeriodType = 'today' | 'week' | 'month' | 'year' | 'custom';

interface TimeRangeOption {
    label: string;
    value: PeriodType | '';
}

interface DateFilterProps {
    onFilterChange: (filters: {
        period?: PeriodType;
        start_date?: string;
        end_date?: string;
    }) => void;
    currentFilters: {
        period?: PeriodType;
        start_date?: string;
        end_date?: string;
    };
}

const DateFilter = ({ onFilterChange, currentFilters }: DateFilterProps) => {
    const timeRangeOptions: TimeRangeOption[] = useMemo(
        () => [
            { label: 'All time', value: '' },
            { label: 'Today', value: 'today' },
            { label: 'This week', value: 'week' },
            { label: 'This month', value: 'month' },
            { label: 'This year', value: 'year' },
            { label: 'Custom range', value: 'custom' },
        ],
        []
    );

    const [currentTimeRange, setCurrentTimeRange] = useState<PeriodType | ''>(
        currentFilters.period || ''
    );
    const [customRange, setCustomRange] = useState<CustomDateRange | undefined>(
        currentFilters.start_date && currentFilters.end_date
            ? { startDate: currentFilters.start_date, endDate: currentFilters.end_date }
            : undefined
    );
    const [showCustomModal, setShowCustomModal] = useState(false);

    const handleTimeRangeChange = (newTimeRange: PeriodType | '') => {
        if (newTimeRange === 'custom') {
            setShowCustomModal(true);
        } else {
            setCurrentTimeRange(newTimeRange);
            setCustomRange(undefined);
            onFilterChange({
                period: newTimeRange || undefined,
                start_date: undefined,
                end_date: undefined,
            });
        }
    };

    const handleCustomDateApply = (customDateRange: CustomDateRange) => {
        setCustomRange(customDateRange);
        setCurrentTimeRange('custom');
        setShowCustomModal(false);
        onFilterChange({
            period: 'custom',
            start_date: customDateRange.startDate,
            end_date: customDateRange.endDate,
        });
    };

    const currentTimeRangeOption = useMemo(() => {
        if (currentTimeRange === 'custom' && customRange) {
            const start = new Date(customRange.startDate);
            const end = new Date(customRange.endDate);
            const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const endLabel = end.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
            });
            return { label: `${startLabel} - ${endLabel}`, value: 'custom' as PeriodType | '' };
        }
        return timeRangeOptions.find((item) => item.value === currentTimeRange) || timeRangeOptions[0];
    }, [currentTimeRange, customRange, timeRangeOptions]);

    return (
			<>
				<div
					className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg pl-5 pr-1
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    cursor-pointer min-w-[140px] relative"
				>
					<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
						<svg
							className="w-5 h-5 text-body"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
							/>
						</svg>
					</div>
					<select
						value={currentTimeRange}
						onChange={(e) =>
							handleTimeRangeChange(e.target.value as PeriodType | '')
						}
						className="outline-none border-none focus:ring-0 ml-2"
					>
						{timeRangeOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{currentTimeRange === 'custom' &&
								customRange &&
								option.value === 'custom'
									? currentTimeRangeOption?.label
									: option.label}
							</option>
						))}
					</select>
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

export default DateFilter;
