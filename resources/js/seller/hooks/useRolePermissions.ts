import {
    useCreatePermissionMutation,
    useCreateRoleMutation,
    useFetchPermissionsQuery,
    useFetchRolesQuery,
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
        createPermission: {
            submit: createPermission,
            isLoading: isCreatePermissionLoading,
            isError: isCreatePermissionError,
            error: createPermissionError,
            data: createPermissionData,
        },
    };
};
export default useRolePermission;
