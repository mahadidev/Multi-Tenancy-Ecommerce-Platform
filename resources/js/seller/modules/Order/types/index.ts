// Order Module Types
export interface Order {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    payment_method: string;
    notes?: string;
    status: string;
    is_payed: boolean;
    is_approved: boolean;
    total: number;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    product_id: number;
    qty: number;
    price: number;
    discount_amount: number;
    tax: number;
    stock_id: number;
    custom_price?: number;
    product?: {
        id: number;
        name: string;
        slug: string;
        sku: string;
        thumbnail: string;
    };
}

export interface PlaceOrderPayload {
    name: string;
    email: string;
    phone: string;
    address: string;
    payment_method: string;
    notes?: string;
    user_id: number;
}

export interface PlaceOrderNonUserPayload {
    id?: number | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    note?: string | null;
    address?: string | null;
    notes?: string;
    payment_method?: string;
    status?: string;
    is_payed?: boolean;
    is_approved?: boolean;
    items: {
        product_id: number;
        qty: number;
        price: number;
        discount_amount: number;
        tax: number;
        stock_id: number;
        custom_price?: number;
    }[];
}

export interface UpdateOrderStatusPayload {
    id: number;
    status: string;
}

export interface BulkShipmentOrderPayload {
    orders: number[];
}

export interface OrderFilters {
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
}