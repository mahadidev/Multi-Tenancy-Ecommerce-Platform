export interface OrdersApiResponse {
    status: number;
    data: OrdersResponse;
}

export interface OrdersResponse {
    orders: OrderType[];
}

export interface OrderType {
    id: number;
    order_uuid: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    user: User;
    store: Store;
    total: string;
    status: string;
    payment_status: null;
    payment_method: string;
    shipping_method: null;
    shipping_cost: null;
    shipping_address: null;
    billing_address: null;
    created_at: string;
    updated_at: string;
    items: Item[];
}

export interface Item {
    id: number;
    order_id: number;
    product_id: number;
    qty: number;
    price: string;
    total: string;
    product: Product;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
}

export interface Store {
    id: number;
    name: string;
    domain: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}
