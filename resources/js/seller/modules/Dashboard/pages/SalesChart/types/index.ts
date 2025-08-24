export type RangeType = 'today' | 'last7days' | 'last30days' | 'last1year' | 'custom';

export interface RangeOption {
	label: string;
	value: RangeType;
}

export interface SalesTotals {
	revenue: number;
	orders: number;
	profit: number;
}

export interface DateRangeDropdownProps {
	onChange: (value: RangeType) => void;
	list: RangeOption[];
	currentValue: RangeOption;
	isLoading?: boolean;
}

export interface MetricsCardsProps {
	totals: SalesTotals;
	formatCurrency: (amount: number) => string;
	showFilterLoader: boolean;
}

export interface SalesChartHeaderProps {
	growthPercentage: string;
	isPositiveGrowth: boolean;
}

export interface SalesChartFooterProps {
	currentRange: RangeOption;
	rangeList: RangeOption[];
	onRangeChange: (value: RangeType) => void;
	isLoading: boolean;
}