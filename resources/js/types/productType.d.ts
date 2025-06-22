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
	is_trending: 0 | 1;
	has_discount: 0 | 1;
	discount_to: null;
	discount_type: null;
	discount_amount: number;
	tax: number;
	created_at: string;
	updated_at: string;
}


export interface ProductVariantOptionType {
	id: number;
	code: string | null;
	label: string;
	price: number | null;
	qty_stock: number | null;
	updated_at: string;
	created_at: string;
}

export interface ProductVariantType {
	id: number;
	label: string;
	slug: string;
	options: ProductVariantOptionType[];
	updated_at: string;
	created_at: string;
}
