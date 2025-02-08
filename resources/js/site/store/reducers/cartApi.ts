import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, createRequest } from '@themes/store/baseQueryWithReAuth';
import { USER_PREFIX } from '@themes/theme_env';

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
			query: (formData) =>
				createRequest({
					url: `${USER_PREFIX}/login`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['User'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, {  queryFulfilled }) {
				await queryFulfilled.then(() => {
					// dispatch(
					// 	setAuth({
					// 		user: response.data.data.user,
					// 		accessToken: response.data.data.access_token,
					// 	})
					// );
				});
			},
		}),
	}),
});

export const { useLoginMutation } =
	cartApi;
