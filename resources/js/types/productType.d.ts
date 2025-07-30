import { BrandType } from "./brandType";
import { CategoryType } from "./categoryType";

export interface ProductType {
	id: number;
	name: string;
	slug: string;
	price: number;
	buying_price?: number;
	discount_price: number;
	sku: string;
	thumbnail: string;
	category: CategoryType;
	short_description: string | null;
	description: string | null;
	attachments: string[];
	brand: BrandType;
	has_in_stocks: 1 | 0;
	stock: null | number;
	status: 1 | 0;
	variants: ProductVariantType[] | null;
	stocks: ProductStockType[];
	is_trending: 0 | 1;
	has_discount: 0 | 1;
	has_variants: 1 | 0;
	discount_to: null;
	discount_type: null;
	discount_amount: number;
	tax: number;
	stockQty: number;
	stockValue: number;
	stockBuyingValue: number;
	created_at: string;
	updated_at: string;
}



export interface ProductVariantOptionType {
	id: number;
	label: string;
	updated_at: string;
	created_at: string;
}

export interface ProductVariantType {
	id: number;
	label: string;
	options: ProductVariantOptionType[];
	updated_at: string;
	created_at: string;
}

export interface ProductStockType {
	id: number;
	product_id: number;
	price: number;
	buying_price: number;
	discount_amount: number;
	qty: number;
	tax: number;
	sku: string | null;
	note: string | null;
	created_at: string;
	updated_at: string;
	stock_items: ProductStockItemType[];
}

export interface ProductStockItemType {
    id: number;
    stock_id: number;
    variant_option_id: number | null;
    created_at: string;
    updated_at: string;
    variant_option: ProductVariantOptionType | null;
    variant: ProductVariantType
}

export interface ProductStockHistoryType {
	id: number;
	product_id: number;
    product: ProductType;
	product_stock_id: number;
	qty: number;
	price: number;
	discount_amount: number;
	buying_price: number;
	tax: number;
	note: string | null;
	type: 'added' | 'removed' | string; // Add more known types if applicable
	created_at: string; // ISO 8601 datetime string
	updated_at: string; // ISO 8601 datetime string
}


export interface ProductSummaryType {
	qty: number;
	buyingValue: number;
	sellingValue: number;
}

