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
