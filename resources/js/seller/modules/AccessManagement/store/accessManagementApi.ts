import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import {
    PermissionResponseDataType,
    RolesResponseDataType,
} from "@type/rolePermissionsType";
import baseQueryWithReAuth, { createRequest } from "@seller/store/baseQueryWithReAuth";
import { setPermissions, setRoles } from "./accessManagementSlice";

export interface RolesFetchResponseType extends ApiResponseType {
    data: RolesResponseDataType;
}

export interface PermissionFetchResponseType extends ApiResponseType {
    data: PermissionResponseDataType;
}

export interface RoleIdPayloadType {
    role_id: number;
}

export interface AssignPermissionToRolePayloadType extends RoleIdPayloadType {
    permission_ids: number[];
}

export const accessManagementApi = createApi({
    reducerPath: "accessManagementApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Roles", "Permissions"],
    endpoints: (builder) => ({
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

        fetchPermissions: builder.query<PermissionFetchResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/permissions`,
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

        updateRole: builder.mutation<
            ApiResponseType,
            { id: number; name: string }
        >({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-roles/${formData?.id}`,
                    method: "post",
                    apiMethod: "PUT",
                    body: formData,
                }),
            invalidatesTags: ["Roles"],
            transformErrorResponse: (error: any) => error.data,
        }),

        assignPermissionToRole: builder.mutation<
            ApiResponseType,
            AssignPermissionToRolePayloadType
        >({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-assign-role-permissions`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Roles"],
            transformErrorResponse: (error: any) => error.data,
        }),

        revokePermission: builder.mutation<ApiResponseType, RoleIdPayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-revoke-all-permissions`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Roles"],
            transformErrorResponse: (error: any) => error.data,
        }),

        deleteRole: builder.mutation<ApiResponseType, { id: number }>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-roles/${formData.id}`,
                    method: "delete",
                    apiMethod: "DELETE",
                    body: formData,
                }),
            invalidatesTags: ["Roles"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchRolesQuery,
    useFetchPermissionsQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPermissionToRoleMutation,
    useRevokePermissionMutation,
} = accessManagementApi;