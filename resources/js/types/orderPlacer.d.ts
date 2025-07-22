import { ProductStockType, ProductType } from './productType';

export interface OrderPlacerCartItemType {
	uniqueID: string;
	product: ProductType;
	stock: ProductStockType;
	qty: number;
	price: number;
	discount_amount: number;
    discount_price: number;
	tax: number;
}

export interface OrderPlacerCartItemVariantType {
    id: number;
	label: string;
	price: number;
}

export interface OrderPlacerCustomerType {
	id?: number | null;
	name?: string | null;
	phone?: string | null;
	email?: string | null;
	note?: string | null;
	address?: string | null;
}

export interface OrderPlacerCartType {
	customer: OrderPlacerCustomerType;
	items: OrderPlacerCartItemType[];
}
