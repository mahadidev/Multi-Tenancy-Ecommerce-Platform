import { FC } from 'react';
import { TrendingProductsFilterType, TrendingProductsFilterOption } from '../types';

interface FilterTabsProps {
	currentFilter: TrendingProductsFilterOption;
	filterOptions: TrendingProductsFilterOption[];
	onFilterChange: (filter: TrendingProductsFilterType) => void;
	isLoading?: boolean;
}

const FilterTabs: FC<FilterTabsProps> = ({ 
	currentFilter, 
	filterOptions, 
	onFilterChange,
	isLoading = false 
}) => {
	return (
		<div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
			{filterOptions.map((option) => (
				<button
					key={option.value}
					onClick={() => onFilterChange(option.value)}
					disabled={isLoading}
					className={`
						px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
						${currentFilter.value === option.value
							? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
							: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
						}
						${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
					`}
				>
					{option.label}
				</button>
			))}
		</div>
	);
};

export default FilterTabs;