export interface UserType {
    name: string;
    email: string;
    accessToken: string;
}
export interface UserProfileType {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role?: string[];
    permissions?: string[];
    is_store_owner?: boolean;
    store_session?: {
        store_id: number;
        store_name: string;
        store_domain: string;
        is_owner: boolean;
    };
}
