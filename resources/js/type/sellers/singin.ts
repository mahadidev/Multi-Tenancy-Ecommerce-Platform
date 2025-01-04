import { BasicApiResponseType, UserType } from "../common";

export interface SigninPayloadType {
    email: string;
    password: string;
}

export interface SigninResponseType extends BasicApiResponseType {
    data: {
        user: UserType;
        token_type: "Bearer";
        access_token: string;
        stores: {
            name: string;
            slug: string;
            domain: string;
            url: string;
        }[];
        membership: {
            type: string;
            period_start: string;
            period_end: string;
        } | null;
    };
}
