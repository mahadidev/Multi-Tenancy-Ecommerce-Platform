export interface VendorType {
    id: number;
    name: string;
    phone?: string;
    address?: string;
    description?: string;
    email?: string;
    contact_person?: string;
    store_id: number;
    store?: {
        id: number;
        name: string;
    };
    created_at: string;
    created_at_human: string;
    updated_at: string;
    updated_at_human: string;
}