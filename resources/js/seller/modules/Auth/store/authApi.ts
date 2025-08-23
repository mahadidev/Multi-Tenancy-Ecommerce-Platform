import { createApi } from "@reduxjs/toolkit/query/react";
import { API_URL, PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { baseQuery, createRequest } from "@seller/store/baseQueryWithReAuth";
import { clearAuth, setAuth, setLoggedInUser } from "./authSlice";
import { clearStore, setAuthStore } from "@seller/store/slices/storeSlice";
import {
  LoginResponse,
  RegisterResponse,
  UserResponse,
  EmailVerificationResponse,
  SocialAuthResponse,
  LoginPayload,
  RegisterPayload,
  EmailVerificationPayload,
  VerifySocialMediaAuthenticationPayload,
  PasswordForgotRequestPayload,
  ResetPasswordPayload,
  UserUpdatePasswordPayload,
} from '../types';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: [
    "User",
    "LoggedInUser",
    "UserProfileUpdate",
    "UserUpdatePassword",
    "PasswordForgotRequest",
    "PasswordReset",
    "DashboardAnalytics",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/login`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["User"],
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
              currentStore: response.data.data.logged_store,
              stores: response.data.data.stores,
            })
          );
        });
      },
    }),

    // login with facebook
    loginWithFacebook: builder.query<SocialAuthResponse, void>({
      query: (formData) =>
        createRequest({
          url: `${API_URL}/auth/facebook?login_type=seller`,
          method: "get",
          body: formData,
        }),
      providesTags: ["User"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // login with google
    loginWithGoogle: builder.query<SocialAuthResponse, void>({
      query: (formData) =>
        createRequest({
          url: `${API_URL}/auth/google?login_type=seller`,
          method: "get",
          body: formData,
        }),
      providesTags: ["User"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // verify social media authentication
    verifySocialMediaAuthentication: builder.mutation<
      ApiResponseType,
      VerifySocialMediaAuthenticationPayload
    >({
      query: (formData) =>
        createRequest({
          url: `${API_URL}/auth/social-login-check`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["User"],
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

    // email verification
    emailVerification: builder.mutation<
      EmailVerificationResponse,
      EmailVerificationPayload
    >({
      query: (formData) =>
        createRequest({
          url: `${API_URL}/verify-email`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["User"],
      transformErrorResponse: (error: any) => error.data,
    }),

    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/register`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["User"],
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
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["User"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then(() => {
          dispatch(clearAuth());
          dispatch(clearStore());
        });
      },
    }),

    // fetch user profile information
    fetchUser: builder.query<UserResponse, void>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/profile`,
          method: "get",
          body: formData,
        }),
      providesTags: ["LoggedInUser"],
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

    // update user profile information
    updateUser: builder.mutation<ApiResponseType, any>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/profile/update`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["UserProfileUpdate"],
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
    updateUserPassword: builder.mutation<
      ApiResponseType,
      UserUpdatePasswordPayload
    >({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/profile/password-change`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["UserUpdatePassword"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then(() => {
          dispatch(clearAuth());
          dispatch(clearStore());
        });
      },
    }),

    // forgot password api
    forgotPasswordRequest: builder.mutation<
      ApiResponseType,
      PasswordForgotRequestPayload
    >({
      query: (formData) =>
        createRequest({
          url: `/forgot-password`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["PasswordForgotRequest"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { queryFulfilled }) {
        await queryFulfilled.then(() => {
          // window.location.href = "/seller/login"; // send to login page
        });
      },
    }),

    // reset password api
    resetPassword: builder.mutation<
      ApiResponseType,
      ResetPasswordPayload
    >({
      query: (formData) =>
        createRequest({
          url: `/password/reset`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["PasswordReset"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { queryFulfilled }) {
        await queryFulfilled.then(() => {
          // window.location.href = "/seller/login"; // send to login page
        });
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogOutMutation,
  useFetchUserQuery,
  useUpdateUserPasswordMutation,
  useUpdateUserMutation,
  useForgotPasswordRequestMutation,
  useResetPasswordMutation,
  useVerifySocialMediaAuthenticationMutation,
  useEmailVerificationMutation,
} = authApi;

// Export legacy types for compatibility
export type {
  LoginPayload as LoginPayloadType,
  RegisterPayload as RegisterPayloadType,
  EmailVerificationPayload as EmailVerificationPayloadType,
  VerifySocialMediaAuthenticationPayload,
  PasswordForgotRequestPayload as PasswordForgotRequestPayloadType,
  ResetPasswordPayload as ResetPasswordPayloadType,
  UserUpdatePasswordPayload as UserUpdatePasswordPayloadType,
};