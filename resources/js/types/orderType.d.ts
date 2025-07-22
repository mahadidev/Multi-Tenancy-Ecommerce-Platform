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


export interface OrderReportType {
	period: string;
	start_date: null | string;
	end_date: null | string;
	total_orders: number;
	total_revenue: number;
	paid_revenue: number;
	pending_revenue: number;
	status_distribution: {
		Paid: number;
	};
	payment_method_distribution: {
		Cash: number;
	};
	daily_trends: [
		{
			date: string;
			order_count: number;
			revenue: number;
		}
	];
	top_products: [
		{
			product_id: number;
			total_quantity: number;
			total_revenue: number;
			product: {
				id: number;
				name: string;
			};
		}
	];
}
