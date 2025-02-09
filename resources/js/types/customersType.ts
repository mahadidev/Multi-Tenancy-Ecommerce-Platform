export interface CustomerDataType {
    customers: CustomerType[];
}

export interface CustomerType {
    id: number;
    name: string;
    email: string;
    phone: null;
    image: null;
    address: null;
    created_at: string;
    updated_at: string;
}
