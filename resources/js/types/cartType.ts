import { ProductType } from "./productType";

export interface CartItemsDataType {
    cart_items: CartItemType[];
}

export interface CartItemType {
    id: number;
    item: string;
    qty: number;
    price: number;
    total: number;
    product: ProductType;
}
