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
    shipping_cost: null;
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
	price: string;
	total: string;
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
