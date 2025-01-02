import { AuthType, UserType } from "@/type";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: [],
    endpoints: (builder) => ({
        loginUser: builder.mutation<any, string>({
            query: (email) =>
                createRequest({
                    url: `${SELLER_PREFIX}/login`,
                    method: "post",
                    body: {
                        email: email,
                    },
                }),
            transformResponse: (response: any) => response.body,
            transformErrorResponse: (error: any) => error.data,
        }),
        registerUser: builder.mutation<
            any,
            {
                name: string;
                email: string;
                password: string;
                confirm_password: string;
            }
        >({
            query: (formData) =>
                createRequest({
                    url: `${SELLER_PREFIX}/register`,
                    method: "post",
                    body: formData,
                }),
            transformResponse: (response: any) => response.body,
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;
