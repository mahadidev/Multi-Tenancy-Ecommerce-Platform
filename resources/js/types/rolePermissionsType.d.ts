export interface RolesResponseDataType {
    roles: RoleType[];
}

export interface PermissionResponseDataType {
    permissions: PermissionType[];
}

export interface RoleType extends PermissionType {
    permissions?: PermissionType[];
}

export interface PermissionType {
    id: number;
    name: string;
    store: number;
    created_at: string;
    updated_at: string;
}
