export interface CartItemsDataType {
    cart_items: CartItemType[];
}

export interface CartItemType {
    id: number;
    item: string;
    qty: number;
    price: number;
    total: number;
    product: CartProductType;
}
export interface CartProductType {
    id: number;
    name: string;
    price: string;
    image: string;
}
