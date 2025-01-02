export interface UserType {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
}
export interface AuthType extends UserType {
    token: string;
}
