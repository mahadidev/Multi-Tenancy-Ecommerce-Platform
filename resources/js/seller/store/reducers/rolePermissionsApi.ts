import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import {
    PermissionResponseDataType,
    RolesResponseDataType,
} from "@type/rolePermissionsType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setPermissions, setRoles } from "../slices/rolePermissionsSlice";

export interface RolesFetchResponseType extends ApiResponseType {
    data: RolesResponseDataType;
}
export interface PermissionFetchResponseType extends ApiResponseType {
    data: PermissionResponseDataType;
}

export const rolePermissionApi = createApi({
    reducerPath: "rolePermissionsApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Roles", "Permissions"],
    endpoints: (builder) => ({
        // roles fetching
        fetchRoles: builder.query<RolesFetchResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-roles`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Roles"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setRoles(response?.data?.data?.roles));
                });
            },
        }),

        // permissions fetching
        fetchPermissions: builder.query<PermissionFetchResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-permissions`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Permissions"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setPermissions(response?.data?.data?.permissions));
                });
            },
        }),

        // role create
        createRole: builder.mutation<ApiResponseType, { name: string }>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-roles`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Roles"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // permission create
        createPermission: builder.mutation<ApiResponseType, { name: string }>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-permissions`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Permissions"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchRolesQuery,
    useFetchPermissionsQuery,
    useCreateRoleMutation,
    useCreatePermissionMutation,
} = rolePermissionApi;
