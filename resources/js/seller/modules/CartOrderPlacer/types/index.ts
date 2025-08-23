// Cart/OrderPlacer Module Types
export interface CartItemType {
    id: string;
    product_id: string;
    user_id: string;
    qty: number;
    price: number;
    product: {
        id: string;
        name: string;
        image: string;
        price: number;
        stock_quantity: number;
    };
    created_at: string;
    updated_at: string;
}

export interface CartItemsDataType {
    cart_items: CartItemType[];
}

export interface CartItemsFetchResponse {
    status: number;
    message: string;
    data: CartItemsDataType;
}

export interface FetchCartItemsPayloadType {
    id: number | string;
}

export interface AddToCartPayloadType {
    user_id: string | number;
    product_id: string | number;
    qty: string | number;
}

export interface UpdateCartPayloadType extends CartIdType {
    qty: string | number;
}

export interface CartIdType {
    cart_id: string | number;
}

export interface CartState {
    cartItems: CartItemType[];
}

// Order Placer Types
export interface OrderPlacerCustomer {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
}

export interface OrderPlacerProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    stock_quantity: number;
    selected?: boolean;
    quantity?: number;
}

export interface OrderPlacerState {
    customer: OrderPlacerCustomer | null;
    selectedProducts: OrderPlacerProduct[];
    orderSummary: {
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        total: number;
    };
    isProcessing: boolean;
}

export interface CreateOrderPayloadType {
    customer: OrderPlacerCustomer;
    products: {
        product_id: string;
        quantity: number;
        price: number;
    }[];
    order_summary: {
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        total: number;
    };
}

export interface OrderReceiptType {
    id: string;
    order_number: string;
    customer: OrderPlacerCustomer;
    products: OrderPlacerProduct[];
    order_summary: {
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        total: number;
    };
    created_at: string;
}