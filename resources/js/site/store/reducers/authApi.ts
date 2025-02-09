import { createApi } from '@reduxjs/toolkit/query/react';
import { USER_PREFIX } from '@site/site_env';
import { baseQuery, createRequest } from '@site/store/baseQueryWithReAuth';
import { clearAuth, setAuth } from '@site/store/slices/authSlice';
import { ApiResponseType } from '@type/apiType';
import { UserProfileType, UserType } from '@type/authType';
import { StoreType } from '@type/storeType';

export const authApi = createApi({
	reducerPath: 'authApi',
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
		login: builder.mutation<LoginResponseType, LoginPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${USER_PREFIX}/login?store_id=${formData.store_id}`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['User'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setAuth({
							user: response.data.data.user,
							accessToken: response.data.data.access_token,
						})
					);
				});
			},
		}),
		register: builder.mutation<ApiResponseType, RegisterPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${USER_PREFIX}/register`,
					method: 'post',
					body: formData,
				}),
			invalidatesTags: ['User'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(
						setAuth({
							user: response.data.data.user,
							accessToken: response.data.data.access_token,
						})
					);
				});
			},
		}),
		logOut: builder.mutation<ApiResponseType, void>({
			query: (formData) =>
				createRequest({
					url: `${USER_PREFIX}/logout`,
					method: 'get',
					body: formData,
				}),
			invalidatesTags: ['User'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled
					.then(() => {
						dispatch(clearAuth());
					})
					.catch(() => {
						dispatch(clearAuth());
					});
			},
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation, useLogOutMutation } =
	authApi;

export interface LoginResponseType extends ApiResponseType {
	data: {
		user: UserType;
		access_token: string;
		logged_store: StoreType;
		stores: StoreType[];
	};
}

export interface LoginPayloadType {
	email: string;
	password: string;
	store_id: number;
}

export interface RegisterPayloadType {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
	store_id: number;
}

export interface RegisterResponseType extends ApiResponseType {
	data: {
		user: UserType;
		access_token: string;
	};
}

export interface UserResponseType extends ApiResponseType {
	data: {
		user: UserProfileType;
	};
}
