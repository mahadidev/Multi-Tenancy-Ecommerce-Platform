import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
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
            async onQueryStarted(_queryArgument, { queryFulfilled }) {
                await queryFulfilled.then(() => {
                    window.location.href = "/seller/login"; // send to login page
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
} = authApi;

export interface UserUpdatePasswordPayloadType {
    old_password: string;
    password: string;
    confirm_password: string;
}

// reset password

export interface PasswordResetRequestPayloadType {
    email: string;
}
