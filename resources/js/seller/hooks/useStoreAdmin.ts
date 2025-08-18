import {
    AdminIdType,
    useCreateAdminMutation,
    useDeleteAdminMutation,
    useFetchAdminsQuery,
    useUpdateAdminMutation,
} from "@seller/store/reducers/storeAdminApi";
import { useAppSelector } from "@seller/store/store";
import { StoreAdminType, CreateStoreAdminType, UpdateStoreAdminType } from "@type/storeAdminType";
import useToast from "./useToast";

const useStoreAdmin = () => {
    // fetch store admins
    useFetchAdminsQuery();

    const { toaster } = useToast();

    // select admins
    const { admins } = useAppSelector((state) => state.storeAdmin);

    // create admin
    const [
        handleCreateAdmin,
        {
            isLoading: isCreateAdminLoading,
            isError: isCreateAdminError,
            error: createAdminError,
            data: createAdminData,
        },
    ] = useCreateAdminMutation();
    const createAdmin = ({
        formData,
        onSuccess,
    }: {
        formData: CreateStoreAdminType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreateAdmin(formData).then((response) => {
            if (response.data?.success) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Admin created successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed create admin",
                    status: "error",
                });
            }
        });
    };

    // update admin
    const [
        handleUpdateAdmin,
        {
            isLoading: isUpdateAdminLoading,
            isError: isUpdateAdminError,
            error: updateAdminError,
            data: updateAdminData,
        },
    ] = useUpdateAdminMutation();
    const updateAdmin = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateStoreAdminType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateAdmin(formData).then((response) => {
            if (response.data?.success) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Admin updated successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed update admin",
                    status: "error",
                });
            }
        });
    };

    // delete admin
    const [
        handleDeleteAdmin,
        {
            isLoading: isDeleteAdminLoading,
            isError: isDeleteAdminError,
            error: deleteAdminError,
            data: deleteAdminData,
        },
    ] = useDeleteAdminMutation();
    const deleteAdmin = ({
        formData,
        onSuccess,
    }: {
        formData: AdminIdType;
        onSuccess?: CallableFunction;
    }) => {
        handleDeleteAdmin(formData).then((response) => {
            if (response.data?.success) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Admin deleted successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed delete admin",
                    status: "error",
                });
            }
        });
    };
    return {
        admins,
        create: {
            submit: createAdmin,
            isLoading: isCreateAdminLoading,
            isError: isCreateAdminError,
            error: createAdminError,
            data: createAdminData,
        },
        update: {
            submit: updateAdmin,
            isLoading: isUpdateAdminLoading,
            isError: isUpdateAdminError,
            error: updateAdminError,
            data: updateAdminData,
        },
        deleteAdmin: {
            submit: deleteAdmin,
            isLoading: isDeleteAdminLoading,
            isError: isDeleteAdminError,
            error: deleteAdminError,
            data: deleteAdminData,
        },
    };
};
export default useStoreAdmin;
