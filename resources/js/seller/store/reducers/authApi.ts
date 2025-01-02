import { SigninPayloadType, SigninResponseType } from "@/type/sellers/singin";
import { SingupPayloadType, SingupResponseType } from "@/type/sellers/singup";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: [],
    endpoints: (builder) => ({
        loginUser: builder.mutation<any, SigninPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${SELLER_PREFIX}/login`,
                    method: "post",
                    body: formData,
                }),
            transformResponse: (response: { body: SigninResponseType }) =>
                response,
            transformErrorResponse: (error: any) => error.data,
        }),
        registerUser: builder.mutation<any, SingupPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${SELLER_PREFIX}/register`,
                    method: "post",
                    body: formData,
                }),
            transformResponse: (response: { body: SingupResponseType }) =>
                response.body,
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;
