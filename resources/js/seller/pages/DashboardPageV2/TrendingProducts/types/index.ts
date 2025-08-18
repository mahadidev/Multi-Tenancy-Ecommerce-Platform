export type TrendingProductsFilterType = 'top_selling' | 'most_revenue' | 'most_profitable' | 'recently_popular';

export type TimeRangeType = 'today' | 'last7days' | 'last30days' | 'last1year';

export interface TrendingProductsFilterOption {
	label: string;
	value: TrendingProductsFilterType;
}

export interface TimeRangeOption {
	label: string;
	value: TimeRangeType;
}

export interface TrendingProductsHeaderProps {
	currentFilter: TrendingProductsFilterOption;
	filterOptions: TrendingProductsFilterOption[];
	onFilterChange: (value: TrendingProductsFilterType) => void;
	currentTimeRange: TimeRangeOption;
	timeRangeOptions: TimeRangeOption[];
	onTimeRangeChange: (value: TimeRangeType) => void;
	isLoading: boolean;
}

export interface ProductListItemProps {
	product: any; // This should be typed according to your TopProductType
	index: number;
	timeRange: string;
}