import { createApi } from '@reduxjs/toolkit/query/react';
import { USER_PREFIX } from '@site/site_env';
import baseQueryWithReAuth, { createRequest } from '../baseQueryWithReAuth';
import { setUserProfile } from '../slices/authSlice';

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: baseQueryWithReAuth,
	tagTypes: ['Profile'],
	endpoints: (builder) => ({
		fetchUserProfile: builder.query<any, void>({
			query: () =>
				createRequest({
					url: `${USER_PREFIX}/profile`,
					method: 'GET',
				}),
			providesTags: ['Profile'],
			transformErrorResponse: (error: any) => error.data,
			async onQueryStarted(_queryArgument, { dispatch,queryFulfilled }) {
				await queryFulfilled.then((response) => {
					dispatch(setUserProfile(response.data.data.user));
				});
			},
		}),
	}),
});

export const { useFetchUserProfileQuery } = userApi;
