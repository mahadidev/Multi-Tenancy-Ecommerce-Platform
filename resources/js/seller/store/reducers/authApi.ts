import { createApi } from "@reduxjs/toolkit/query/react";
import { API_URL, PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { UserProfileType, UserType } from "@type/authType";
import { StoreType } from "@type/storeType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { clearAuth, setAuth, setLoggedInUser } from "../slices/authSlice";
import { clearStore, setAuthStore } from "../slices/storeSlice";

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

export interface UserResponseType extends ApiResponseType {
    data: {
        user: UserProfileType;
    };
}

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
        login: builder.mutation<LoginResponseType, LoginPayloadType>({
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
        loginWithFacebook: builder.query<LoginResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/auth/facebook?login_type=seller`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["User"],
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
        loginWithGoogle: builder.query<LoginResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/auth/google?login_type=seller`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["User"],
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
        register: builder.mutation<ApiResponseType, RegisterPayloadType>({
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
                    method: "get",
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
        fetchUser: builder.query<UserResponseType, void>({
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
        updateUser: builder.mutation<ApiResponseType, UserProfileType>({
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
            UserUpdatePasswordPayloadType
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
            PasswordForgotRequestPayloadType
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
            ResetPasswordPayloadType
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
    useLoginWithFacebookQuery,
    useLoginWithGoogleQuery,
} = authApi;

export interface UserUpdatePasswordPayloadType {
    old_password: string;
    password: string;
    confirm_password: string;
}

// forgot password payload type
export interface PasswordForgotRequestPayloadType {
    email: string;
}

// reset password payload type
export interface ResetPasswordPayloadType {
    email: string;
    token: string;
    password: string;
    confirm_password: string;
}
