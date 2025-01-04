import { BasicApiResponseType, UserType } from "../common";

export interface SingupPayloadType {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface SingupResponseType extends BasicApiResponseType {
    data: {
        user: UserType;
        token_type: "Bearer";
        access_token: string;
    };
}
