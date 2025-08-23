import {
    CreateVendorPayloadType,
    DeleteVendorPayloadType,
    UpdateVendorPayloadType,
    useCreateVendorMutation,
    useDeleteVendorMutation,
    useFetchVendorsQuery,
    useUpdateVendorMutation,
} from "@seller/store/reducers/vendorApi";
import { useAppSelector } from "@seller/store/store";
import useToast from "./useToast";

const useVendor = () => {
    // fetch vendors
    useFetchVendorsQuery();

    // toast hook
    const { toaster } = useToast();

    // select vendor state
    const { vendors, meta } = useAppSelector((state) => state.vendor);

    // create vendor
    const [
        handleCreate,
        {
            isLoading: isCreateLoading,
            isError: isCreateError,
            error: createError,
            data: createData,
        },
    ] = useCreateVendorMutation();
    
    const create = ({
        formData,
        onSuccess,
    }: {
        formData: CreateVendorPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Vendor created successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to create vendor",
                    status: "error",
                });
            }
        });
    };

    // update vendor
    const [
        handleUpdate,
        {
            isLoading: isUpdateLoading,
            isError: isUpdateError,
            error: updateError,
            data: updateData,
        },
    ] = useUpdateVendorMutation();
    
    const update = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateVendorPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Vendor updated successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to update vendor",
                    status: "error",
                });
            }
        });
    };

    // delete vendor
    const [
        handleDelete,
        {
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            error: deleteError,
            data: deleteData,
        },
    ] = useDeleteVendorMutation();
    
    const deleteVendor = ({
        formData,
        onSuccess,
    }: {
        formData: DeleteVendorPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleDelete(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Vendor deleted successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to delete vendor",
                    status: "error",
                });
            }
        });
    };

    return {
        vendors,
        meta,
        create: {
            submit: create,
            isLoading: isCreateLoading,
            isError: isCreateError,
            error: createError,
            data: createData,
        },
        update: {
            submit: update,
            isLoading: isUpdateLoading,
            isError: isUpdateError,
            error: updateError,
            data: updateData,
        },
        delete: {
            submit: deleteVendor,
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            error: deleteError,
            data: deleteData,
        },
    };
};

export default useVendor;