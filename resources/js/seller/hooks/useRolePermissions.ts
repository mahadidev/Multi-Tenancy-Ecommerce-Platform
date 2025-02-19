import {
    AssignPermissionToRolePayloadType,
    RoleIdPayloadType,
    useAssignPermissionToRoleMutation,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useFetchPermissionsQuery,
    useFetchRolesQuery,
    useRevokePermissionMutation,
    useUpdateRoleMutation,
} from "@seller/store/reducers/rolePermissionsApi";
import { useAppSelector } from "@seller/store/store";
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

    // assign permission
    const [
        handleAssignPermission,
        {
            isLoading: isAssignPermissionLoading,
            isError: isAssignPermissionError,
            error: assignPermissionError,
            data: assignPermissionData,
        },
    ] = useAssignPermissionToRoleMutation();
    const assignPermission = ({
        formData,
        onSuccess,
    }: {
        formData: AssignPermissionToRolePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleAssignPermission(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Permission assigned successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to assign permission",
                    status: "error",
                });
            }
        });
    };

    // revoke permission
    const [
        handleRevokePermission,
        {
            isLoading: isRevokePermissionLoading,
            isError: isRevokePermissionError,
            error: revokePermissionError,
            data: revokePermissionData,
        },
    ] = useRevokePermissionMutation();
    const revokePermission = ({
        formData,
        onSuccess,
    }: {
        formData: RoleIdPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleRevokePermission(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Permission revoked successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to revoke permission",
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
        assignPermission: {
            submit: assignPermission,
            isLoading: isAssignPermissionLoading,
            isError: isAssignPermissionError,
            error: assignPermissionError,
            data: assignPermissionData,
        },
        revokePermission: {
            submit: revokePermission,
            isLoading: isRevokePermissionLoading,
            isError: isRevokePermissionError,
            error: revokePermissionError,
            data: revokePermissionData,
        },
    };
};
export default useRolePermission;
