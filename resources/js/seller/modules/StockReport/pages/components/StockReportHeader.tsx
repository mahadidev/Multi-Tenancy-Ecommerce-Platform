import { FC } from 'react';
import { Button } from 'flowbite-react';
import { HiChartPie, HiDownload, HiRefresh, HiArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';

type TimeRangeType = 'today' | 'week' | 'month' | 'year';

interface StockReportHeaderProps {
	timeRange: TimeRangeType;
	onTimeRangeChange: (range: TimeRangeType) => void;
	onRefresh: () => void;
	onExport: () => void;
}

const StockReportHeader: FC<StockReportHeaderProps> = ({
	timeRange,
	onTimeRangeChange,
	onRefresh,
	onExport
}) => {
	const timeRanges: { value: TimeRangeType; label: string }[] = [
		{ value: 'today', label: 'Today' },
		{ value: 'week', label: '7 Days' },
		{ value: 'month', label: '30 Days' },
		{ value: 'year', label: '1 Year' }
	];

	return (
		<div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
			<div className="px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					{/* Left Section */}
					<div className="flex items-center space-x-4">
						<Link
							to="/"
							className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							<HiArrowLeft className="w-5 h-5" />
						</Link>
						<div className="flex items-center space-x-3">
							<div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
								<HiChartPie className="w-8 h-8 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
									Stock Report
								</h1>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Comprehensive inventory and stock analytics
								</p>
							</div>
						</div>
					</div>

					{/* Right Section */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						{/* Time Range Selector */}
						<div className="flex items-center space-x-2">
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Period:
							</span>
							<div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
								{timeRanges.map((range) => (
									<button
										key={range.value}
										onClick={() => onTimeRangeChange(range.value)}
										className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
											timeRange === range.value
												? 'bg-blue-600 text-white shadow-sm'
												: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
										}`}
									>
										{range.label}
									</button>
								))}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center space-x-2">
							<Button
								size="sm"
								color="gray"
								onClick={onRefresh}
								className="text-gray-600 dark:text-gray-400"
							>
								<HiRefresh className="w-4 h-4 mr-2" />
								Refresh
							</Button>
							<Button
								size="sm"
								onClick={onExport}
								className="bg-blue-600 hover:bg-blue-700 text-white border-0"
							>
								<HiDownload className="w-4 h-4 mr-2" />
								Export
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StockReportHeader;