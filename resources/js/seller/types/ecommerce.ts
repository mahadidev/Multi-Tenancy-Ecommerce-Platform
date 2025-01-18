import { CategoryType } from "./store";

export interface ProductType {
    id: number;
    name: string;
    slug: string;
    price: number;
    sku: string;
    thumbnail: string;
    category: CategoryType;
}
