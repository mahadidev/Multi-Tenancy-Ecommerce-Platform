import {
    LoginPayloadType,
    RegisterPayloadType,
} from '@site/store/reducers/authApi';
import { ApiResponseType } from './apiType';
import { UserProfileType, UserType } from './authType';

export interface ThemeHooksType {
	useAuth: () => {
		user: UserType | null;
		login: {
			submit: ({
				formData,
				onSuccess,
			}: {
				formData: LoginPayloadType;
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
		};
		register: {
			submit: ({
				formData,
				onSuccess,
			}: {
				formData: RegisterPayloadType;
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
		};
		logOut: {
			submit: ({
				onSuccess,
			}: {
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
		};
	};
	useUser: () => {
		userProfileData: UserProfileType | null;
	};
}
