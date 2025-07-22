export interface DashboardAnalytics {
	products_count: number;
	categories_count: number;
	orders_count: number;
	customers_count: number;
	visitor_count: number;
	unique_visitor_count: number;
	unique_visitor_today_count: number;
	order_analytics: {
		total_revenue: number;
		average_order_value: number;
		filter: 'month';
		orders: [];
		monthly_revenues: [];
	};
	productAnalytics: number;
	product: {
		valuation: {
			total: number;
			totalDiscounted: number;
		};
	};
}
