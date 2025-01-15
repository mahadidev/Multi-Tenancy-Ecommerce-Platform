import { SigninPayloadType, SigninResponseType } from "@/type/sellers/singin";
import { SingupPayloadType, SingupResponseType } from "@/type/sellers/singup";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { SELLER_PREFIX } from "../env";
import { setAuth } from "../slices/authSlice";
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

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        loginUser: builder.mutation<any, SigninPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${SELLER_PREFIX}/login`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["User"],
            transformResponse: (response: { data: SigninResponseType }) =>
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
            invalidatesTags: ["User"],
            async onQueryStarted(_formData, { dispatch, queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled;

                    dispatch(
                        setAuth({
                            access_token: response.data.access_token,
                            token_type: response.data.token_type,
                            user: response.data.user,
                        })
                    );
                } catch (err) {
                    /* empty */
                }
            },
            transformResponse: (response: { data: SingupResponseType }) =>
                response,
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;
