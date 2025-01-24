export interface UserType {
	id: number;
	address: string | null;
	email: string;
	image: string | null;
	name: string | null;
	phone: null | string;
}

export interface BasicApiResponseType {
    message: string;
    status: number;
}
