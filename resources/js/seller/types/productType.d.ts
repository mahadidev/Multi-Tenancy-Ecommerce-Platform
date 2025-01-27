import { CategoryType } from "./categoryType";

export interface ProductType {
	id: number;
	name: string;
	slug: string;
	price: number;
	sku: string;
	thumbnail: string;
	category: CategoryType;
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
