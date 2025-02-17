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
    phone: null;
    address: null;
    image: null;
    store_session: StoreSession;
}

export interface StoreSession {
    store_id: number;
    store_name: string;
    store_domain: string;
}
