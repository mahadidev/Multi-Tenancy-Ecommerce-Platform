import { GLOBAL_APP_API_URL } from '@helper/global_env';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = fetchBaseQuery({
	baseUrl: GLOBAL_APP_API_URL,
	prepareHeaders: (headers: Headers) => {
		headers.set('accept', 'application/json');

		return headers;
	},
});

export const createRequest = ({
	url,
	method = 'GET',
	body,
	apiMethod,
}: {
	url: string;
	method?: string;
	body?: any;
	apiMethod?: string;
}) => {
	if (apiMethod) {
		return {
			url,
			method,
			body: { ...body, _method: apiMethod },
		};
	}

	return {
		url,
		method,
		body,
	};
};
