import { UserType } from "./authType";
import { ProductType } from "./productType";
import { StoreType } from "./storeType";

export interface OrdersApiResponse {
    status: number;
    data: OrdersResponse;
}

export interface OrdersResponse {
    orders: OrderType[];
}

export interface OrderType {
    id: number;
    order_uuid: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    user: UserType;
    store: StoreType;
    total: string;
    status: string;
    payment_status: null;
    payment_method: string;
    shipping_method: null;
    shipping_cost: null | number;
    shipping_address: null;
    billing_address: null;
    created_at: string;
    updated_at: string;
    items: OrderItemType[];
}

export interface OrderItemType {
	id: number;
	order_id: number;
	product_id: number;
	qty: number;
	price: number;
    total: number;
	discount_price: number;
	tax: number;
	item: string;
	product: ProductType;
}

export interface OrderProduct extends ProductType {
	selectedVariants: OrderProductVariantType[];
}

export interface OrderProductVariantType {
	label: string;
	value: string;
    price: number;
}


interface OrderReportType {
	period: string;
	start_date: string | null;
	end_date: string | null;
	total_orders: number;
	total_revenue: number;
	paid_revenue: number;
	pending_revenue: number;
	status_distribution: {
		[key: string]: number; // Keys are status names, values are counts
	};
	payment_method_distribution: {
		[key: string]: number; // Keys are payment methods, values are counts
	};
	daily_trends: DailyTrend[];
	top_products: TopProductType[];
	chartSeries: {
		[key: string]: {
			order_count: number;
			revenue: number;
		};
	};
}

interface DailyTrend {
	date: string; // Format: YYYY-MM-DD
	order_count: number;
	revenue: string; // String for the revenue (could also be a number depending on the format)
}

interface TopProductType {
	product_id: number;
	total_quantity: number; // Quantity as a string
	total_revenue: number; // Revenue as a string
	product: ProductType;
}
