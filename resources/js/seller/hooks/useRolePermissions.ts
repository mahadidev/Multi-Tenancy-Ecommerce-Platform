import {
    useCreatePermissionMutation,
    useCreateRoleMutation,
    useDeletePermissionMutation,
    useDeleteRoleMutation,
    useFetchPermissionsQuery,
    useFetchRolesQuery,
    useUpdatePermissionMutation,
    useUpdateRoleMutation,
} from "@seller/store/reducers/rolePermissionsApi";
import { useAppSelector } from "@seller/store/store";
import { PermissionType } from "@type/rolePermissionsType";
import useToast from "./useToast";

const useRolePermission = () => {
    // fetch roles
    useFetchRolesQuery();

    // fetch permissions
    useFetchPermissionsQuery();

    // toast hook
    const { toaster } = useToast();

    // select role and permissions
    const { roles, permissions } = useAppSelector(
        (state) => state.rolePermission
    );

    // create role
    const [
        handleCreateRole,
        {
            isLoading: isCreateRoleLoading,
            isError: isCreateRoleError,
            error: createRoleError,
            data: createRoleData,
        },
    ] = useCreateRoleMutation();
    const createRole = ({
        formData,
        onSuccess,
    }: {
        formData: { name: string };
        onSuccess?: CallableFunction;
    }) => {
        handleCreateRole(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Role created successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to create role",
                    status: "error",
                });
            }
        });
    };

    // create permission
    const [
        handleCreatePermission,
        {
            isLoading: isCreatePermissionLoading,
            isError: isCreatePermissionError,
            error: createPermissionError,
            data: createPermissionData,
        },
    ] = useCreatePermissionMutation();
    const createPermission = ({
        formData,
        onSuccess,
    }: {
        formData: PermissionType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreatePermission(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Permission created successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to create permission",
                    status: "error",
                });
            }
        });
    };

    // update role
    const [
        handleUpdateRole,
        {
            isLoading: isUpdateRoleLoading,
            isError: isUpdateRoleError,
            error: updateRoleError,
            data: updateRoleData,
        },
    ] = useUpdateRoleMutation();
    const updateRole = ({
        formData,
        onSuccess,
    }: {
        formData: { id: number; name: string };
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateRole(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Role updated successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to update role",
                    status: "error",
                });
            }
        });
    };

    // update permission
    const [
        handleUpdatePermission,
        {
            isLoading: isUpdatePermissionLoading,
            isError: isUpdatePermissionError,
            error: updatePermissionError,
            data: updatePermissionData,
        },
    ] = useUpdatePermissionMutation();
    const updatePermission = ({
        formData,
        onSuccess,
    }: {
        formData: { name: string; id: number };
        onSuccess?: CallableFunction;
    }) => {
        handleUpdatePermission(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Permission updated successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to update permission",
                    status: "error",
                });
            }
        });
    };

    // delete role
    const [
        handleDeleteRole,
        {
            isLoading: isDeleteRoleLoading,
            isError: isDeleteRoleError,
            error: deleteRoleError,
            data: deleteRoleData,
        },
    ] = useDeleteRoleMutation();
    const deleteRole = ({
        formData,
        onSuccess,
    }: {
        formData: { id: number };
        onSuccess?: CallableFunction;
    }) => {
        handleDeleteRole(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Role deleted successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to delete role",
                    status: "error",
                });
            }
        });
    };

    // delete permission
    const [
        handleDeletePermission,
        {
            isLoading: isDeletePermissionLoading,
            isError: isDeletePermissionError,
            error: deletePermissionError,
            data: deletePermissionData,
        },
    ] = useDeletePermissionMutation();
    const deletePermission = ({
        formData,
        onSuccess,
    }: {
        formData: { id: number };
        onSuccess?: CallableFunction;
    }) => {
        handleDeletePermission(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Permission deleted successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to delete permission",
                    status: "error",
                });
            }
        });
    };

    return {
        roles,
        permissions,
        createRole: {
            submit: createRole,
            isLoading: isCreateRoleLoading,
            isError: isCreateRoleError,
            error: createRoleError,
            data: createRoleData,
        },
        updateRole: {
            submit: updateRole,
            isLoading: isUpdateRoleLoading,
            isError: isUpdateRoleError,
            error: updateRoleError,
            data: updateRoleData,
        },
        deleteRole: {
            submit: deleteRole,
            isLoading: isDeleteRoleLoading,
            isError: isDeleteRoleError,
            error: deleteRoleError,
            data: deleteRoleData,
        },
        createPermission: {
            submit: createPermission,
            isLoading: isCreatePermissionLoading,
            isError: isCreatePermissionError,
            error: createPermissionError,
            data: createPermissionData,
        },
        updatePermission: {
            submit: updatePermission,
            isLoading: isUpdatePermissionLoading,
            isError: isUpdatePermissionError,
            error: updatePermissionError,
            data: updatePermissionData,
        },
        deletePermission: {
            submit: deletePermission,
            isLoading: isDeletePermissionLoading,
            isError: isDeletePermissionError,
            error: deletePermissionError,
            data: deletePermissionData,
        },
    };
};
export default useRolePermission;
