import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { baseQuery, createRequest } from "@seller/store/baseQueryWithReAuth";
import { setLoggedInUser } from "@seller/modules/Auth/store/authSlice";
import {
  ProfileResponse,
  ProfileUpdateResponse,
  PasswordUpdateResponse,
  ProfileUpdatePayload,
  PasswordUpdatePayload,
} from '../types';

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQuery,
  tagTypes: [
    "Profile",
    "ProfileUpdate",
    "PasswordUpdate",
  ],
  endpoints: (builder) => ({
    // fetch user profile information
    fetchProfile: builder.query<ProfileResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/profile`,
          method: "get",
        }),
      providesTags: ["Profile"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // update user profile information
    updateProfile: builder.mutation<ProfileUpdateResponse, ProfileUpdatePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/profile/update`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Profile", "ProfileUpdate"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setLoggedInUser({
              loggedInUser: response?.data?.data?.user,
            })
          );
        });
      },
    }),

    // update user password
    updatePassword: builder.mutation<PasswordUpdateResponse, PasswordUpdatePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/profile/password-change`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["PasswordUpdate"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = profileApi;

// Export types for use in hooks
export type {
  ProfileUpdatePayload,
  PasswordUpdatePayload,
};