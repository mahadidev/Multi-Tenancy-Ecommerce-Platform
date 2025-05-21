import {
    LoginPayloadType,
    RegisterPayloadType,
} from '@site/store/reducers/authApi';
import { ApiResponseType } from './apiType';
import { UserProfileType, UserType } from './authType';

export interface HookFuncType {
	submit: ({
		formData,
		onSuccess,
	}: {
		formData: any;
		onSuccess?: (data: ApiResponseType) => void;
	}) => void;
	isLoading: boolean;
	error:
		| {
				message: string;
				errros?: {
					[String: key]: string[];
				}[];
		  }
		| any
		| undefined;
	data: ApiResponseType | undefined;
	isSuccess: boolean;
}

export interface ThemeHooksType {
	useAuth?: () => {
		user: UserType | null;
		login: HookFuncType;
		register: HookFuncType;
		logOut: HookFuncType;
	};
}
