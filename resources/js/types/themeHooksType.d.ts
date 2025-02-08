import {
    LoginPayloadType,
    RegisterPayloadType,
} from '@site/store/reducers/authApi';
import { ApiResponseType } from './apiType';

export interface ThemeHooksType {
	auth: {
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
		};
	};
}
