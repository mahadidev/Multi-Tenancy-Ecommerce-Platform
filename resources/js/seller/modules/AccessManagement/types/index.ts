// AccessManagement Module Types
export interface Role {
    id: number;
    name: string;
    slug: string;
    permissions?: Permission[];
    store_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
    group?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateRolePayload {
    name: string;
}

export interface UpdateRolePayload {
    id: number;
    name: string;
}

export interface DeleteRolePayload {
    id: number;
}

export interface AssignPermissionToRolePayload {
    role_id: number;
    permission_ids: number[];
}

export interface RoleIdPayload {
    role_id: number;
}

export interface RoleFilters {
    search?: string;
    store_id?: number;
}

export interface PermissionFilters {
    search?: string;
    group?: string;
}