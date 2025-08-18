export interface RolesResponseDataType {
    roles: RoleType[];
}

export interface PermissionResponseDataType {
    permissions: PermissionType[];
}

export interface RoleType {
    id: number;
    name: string;
    slug: string;
    description?: string;
    store_id?: number;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    permissions?: PermissionType[];
}

export interface PermissionType {
    id: number;
    name: string;
    slug: string;
    description?: string;
    group: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
