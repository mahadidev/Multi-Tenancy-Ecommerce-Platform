import { FC } from 'react';
import { HiTrendingUp, HiEye } from 'react-icons/hi';
import { FilterDropdown } from '@seller/components/Filters';
import { TrendingProductsHeaderProps } from '../types';

const TrendingProductsHeader: FC<TrendingProductsHeaderProps> = ({
	currentFilter,
	filterOptions,
	onFilterChange,
	currentTimeRange,
	timeRangeOptions,
	onTimeRangeChange,
	isLoading
}) => {
	return (
		<div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				{/* Left Section - Title & Icon */}
				<div className="flex items-center space-x-4">
					<div className="bg-white/20 p-3 rounded-lg">
						<HiTrendingUp className="w-6 h-6" />
					</div>
					<div>
						<h3 className="text-xl font-bold mb-1">Trending Products</h3>
						<p className="text-emerald-100 text-sm">Top performing products in your store</p>
					</div>
				</div>

				{/* Right Section - Filters */}
				<div className="flex flex-col sm:flex-row gap-3">
					<FilterDropdown
						currentValue={currentFilter}
						onChange={onFilterChange}
						list={filterOptions}
						isLoading={isLoading}
						className="min-w-[160px]"
					/>
					
					<FilterDropdown
						currentValue={currentTimeRange}
						onChange={onTimeRangeChange}
						list={timeRangeOptions}
						isLoading={isLoading}
						className="min-w-[140px]"
					/>
				</div>
			</div>

			{/* View All Link */}
			<div className="flex justify-end mt-4">
				<button className="flex items-center space-x-1 text-sm text-emerald-100 hover:text-white transition-colors">
					<HiEye className="w-4 h-4" />
					<span>View All Products</span>
				</button>
			</div>
		</div>
	);
};

export default TrendingProductsHeader;