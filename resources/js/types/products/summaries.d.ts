export interface ProductSummaryChartSeriesType {
	[key: string]: { qty: number; buyingValue: number; sellingValue: number };
}
export interface ProductSummaryType {
	chartSeries: ProductSummaryChartSeriesType;
	qty: number;
	buyingValue: number;
	sellingValue: number;
}
