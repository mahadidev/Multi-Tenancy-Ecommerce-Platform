import { ProductType } from "./productType";

export interface OrderPlacerCartItemType {
	uniqueID: string;
	qty: number;
	discount: number;
	product: ProductType;
	price: number;
	afterDiscountPrice: number;
	afterTaxPrice: number;
	taxAmount: number;
	variants?: {
		label: string;
		value: string;
		price: number;
	}[];
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
    customer: OrderPlacerCustomerType,
    items: OrderPlacerCartItemType[]
}
