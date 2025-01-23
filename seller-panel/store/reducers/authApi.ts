
import { createApi } from '@reduxjs/toolkit/query/react';
import { PREFIX } from '@seller-panel/env';
import { clearAuth, setAuth } from '@seller-panel/store/slices/authSlice';
import { clearStore, setAuthStore } from '@seller-panel/store/slices/storeSlice';
import { ApiResponseType } from '@seller-panel/types/apiType';
import { UserType } from '@seller-panel/types/authType';
import { StoreType } from '@seller-panel/types/storeType';
import { baseQuery, createRequest } from '../baseQueryWithReAuth';

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
    password: string
}

export interface RegisterPayloadType {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}

export interface RegisterResponseType extends ApiResponseType {
	data: {
		user: UserType;
		access_token: string;
	};
}

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: baseQuery,
	tagTypes: ['User'],
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponseType, LoginPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/login`,
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
					dispatch(
						setAuthStore({
							store: response.data.data.logged_store,
							stores: response.data.data.stores,
						})
					);
				});
			},
		}),
		register: builder.mutation<ApiResponseType, RegisterPayloadType>({
			query: (formData) =>
				createRequest({
					url: `${PREFIX}/register`,
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
					url: `${PREFIX}/logout`,
					method: 'get',
					body: formData,
				}),
			invalidatesTags: ['User'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
				await queryFulfilled.then(() => {
					dispatch(clearAuth());
					dispatch(clearStore());
				});
			},
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation, useLogOutMutation } = authApi;
