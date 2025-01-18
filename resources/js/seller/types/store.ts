export interface CategoryType {
    id: number;
    store_id: number;
    name: string;
    slug: string;
    type: "product" | "post" | "blog";
    has_parent: null | CategoryType;
}

export interface BrandType {
    id: number;
    store_id: number;
    name: string;
    slug: string;
    image: string;
}
