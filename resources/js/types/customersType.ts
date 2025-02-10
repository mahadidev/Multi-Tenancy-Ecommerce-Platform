export interface CustomerDataType {
    customers: CustomerType[];
}

export interface CustomerType {
    id?: number;
    name: string;
    email: string;
    phone: string;
    image?: string;
    address: string;
    password?: string;
    confirm_password?: string;
    created_at?: string;
    updated_at?: string;
}
