export interface ProductSummaryChartSeriesType {
	[key: string]: { qty: number; buyingValue: number; sellingValue: number };
}
export interface ProductSummaryType {
	// Dashboard metrics
	totalProducts: number;
	totalBuyingValue: number;
	outOfStock: number;
	totalValue: number;
	// Historical data for charts
	chartSeries: ProductSummaryChartSeriesType;
	qty: number;
	buyingValue: number;
	sellingValue: number;
}
