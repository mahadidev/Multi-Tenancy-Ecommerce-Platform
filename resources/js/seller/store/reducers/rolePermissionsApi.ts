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

export interface RoleIdPayloadType {
    role_id: number;
}

export interface AssignPermissionToRolePayloadType extends RoleIdPayloadType {
    permission_ids: number[];
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

        // role update
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

        // assign permission
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

        // revoke permissions
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

        // role delete
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
} = rolePermissionApi;
