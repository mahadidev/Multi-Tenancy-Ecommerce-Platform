import { createApi } from '@reduxjs/toolkit/query/react';
import { USER_PREFIX } from '@site/site_env';
import { baseQuery, createRequest } from '../baseQueryWithReAuth';

export const cartApi = createApi({
	reducerPath: 'cartApi',
	baseQuery: baseQuery,
	tagTypes: ['Cart'],
	endpoints: (builder) => ({
		fetchCart: builder.query<any, void>({
			query: () =>
				createRequest({
					url: `${USER_PREFIX}/login`,
					method: 'GET',
				}),
			providesTags: ['Cart'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const { useFetchCartQuery } =
	cartApi;
