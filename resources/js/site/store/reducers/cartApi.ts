import { createApi } from '@reduxjs/toolkit/query/react';
import { USER_PREFIX } from '@site/site_env';
import { baseQuery, createRequest } from '../baseQueryWithReAuth';

export const cartApi = createApi({
	reducerPath: 'cartApi',
	baseQuery: baseQuery,
	tagTypes: [
		'User',
		'LoggedInUser',
		'UserProfileUpdate',
		'UserUpdatePassword',
		'PasswordForgotRequest',
		'PasswordReset',
		'DashboardAnalytics',
	],
	endpoints: (builder) => ({
		login: builder.mutation<any, any>({
			query: (formData: any) =>
				createRequest({
					url: `${USER_PREFIX}/login`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['User'],
			transformErrorResponse: (error: any) => error.data,
		}),
	}),
});

export const { useLoginMutation } =
	cartApi;
