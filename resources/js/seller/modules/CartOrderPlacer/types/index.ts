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
    payment_method?: string;
}

export interface OrderPlacerProduct {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    image: string;
    stock_quantity: number;
    selected?: boolean;
    quantity?: number;
    selectedVariants?: { [variantId: number]: any };
    stockId?: number;
    tax?: number;
    discount_amount?: number;
    discount_type?: 'flat' | 'percentage';
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
    name: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
    status?: string;
    payment_method?: string;
    is_payed?: boolean;
    is_approved?: boolean;
    items: {
        product_id: string;
        stock_id: number;
        qty: number;
        price: number;
        custom_price?: number;
        discount_amount?: number;
        tax?: number;
    }[];
}

export interface OrderReceiptType {
    id: string;
    order_uuid: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    total: number;
    items: Array<{
        id: string;
        item: string;
        qty: number;
        price: number;
        discount_price?: number;
        total: number;
        tax: number;
        product: {
            id: string;
            name: string;
            price: number;
        };
    }>;
    created_at: string;
}
