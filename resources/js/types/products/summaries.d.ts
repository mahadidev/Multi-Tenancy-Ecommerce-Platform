export interface ProductSummaryChartSeriesType {
	qty: number;
	buyingValue: number;
	sellingValue: number;
}
export interface ProductSummaryType {
	[key: string]: {
		chartSeries: ProductSummaryChartSeriesType;
		qty: number;
		buyingValue: number;
		sellingValue: number;
	};
}
