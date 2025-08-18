export interface StoreAdminFetchResponseType {
    data: StoreAdminResponseDataType;
}

export interface StoreAdminResponseDataType {
    store_admins: StoreAdminType[];
}

export interface StoreAdminType {
    id: number;
    name: string;
    email: string;
    role: string[];
    phone: string | null;
    address: string | null;
    image: string | null;
    store_session: StoreSession;
}

export interface CreateStoreAdminType {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    address?: string;
    role_ids: number[];
}

export interface UpdateStoreAdminType {
    id: number;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    phone?: string;
    address?: string;
    role_ids: number[];
}

export interface StoreSession {
    store_id: number;
    store_name: string;
    store_domain: string;
}
