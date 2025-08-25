// Product Module Types
export interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    category_id: number;
    price: number;
    buying_price?: number;
    discount_price?: number;
    thumbnail: string;
    attachments: string[];
    variants?: ProductVariant[];
    created_at?: string;
    updated_at?: string;
}

export interface ProductVariant {
    id?: number;
    label: string;
    options: ProductVariantOption[];
}

export interface ProductVariantOption {
    id?: number;
    label: string;
    value?: string;
}

import type { ServerTableFilters } from '@seller/_hooks/types/table';

export interface ProductFilters extends ServerTableFilters {
    category_id?: number;
    price_min?: number;
    price_max?: number;
    status?: string;
    sort_by?: 'name' | 'sku' | 'price' | 'created_at' | 'updated_at';
}

export interface CreateProductPayload {
    name: string;
    slug: string;
    sku: string;
    category_id: number;
    price: number;
    buying_price?: number;
    discount_price?: number;
    thumbnail: string;
    attachments: string[];
}

export interface UpdateProductPayload {
    id: number;
    name?: string;
    slug?: string;
    category_id?: number;
    price?: number;
    thumbnail?: string;
    attachments?: string[];
}

export interface DeleteProductPayload {
    id: number | string;
}

export interface FetchProductPayload {
    id: number | string;
}

export interface GenerateBarcodePayload {
    id: number | string;
}

export interface ProductSummaryFilters {
    range?: 'today' | 'week' | 'month' | 'year' | 'custom';
    start_date?: string;
    end_date?: string;
}