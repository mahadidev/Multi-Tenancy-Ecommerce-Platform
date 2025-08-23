import {
    CreateBrandPayloadType,
    DeleteBrandPayloadType,
    UpdateBrandPayloadType,
    useCreateBrandMutation,
    useDeleteBrandMutation,
    useFetchBrandsQuery,
    useUpdateBrandMutation,
} from "@seller/store/reducers/brandApi";
import { useAppSelector } from "@seller/store/store";
import useToast from "./useToast";

const useBrand = () => {
    // toaster hook
    const { toaster } = useToast();

    // fetch brands
    useFetchBrandsQuery();

    // select brand
    const { brands, meta } = useAppSelector((state) => state.brand);

    // create brand
    const [
        handleCreate,
        {
            isLoading: isCreateLoading,
            isError: isCreateError,
            error: createError,
            data: createData,
        },
    ] = useCreateBrandMutation();
    const create = ({
        formData,
        onSuccess,
    }: {
        formData: CreateBrandPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Brand created successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to create brand",
                    status: "error",
                });
            }
        });
    };

    // update brand
    const [
        handleUpdate,
        {
            isLoading: isUpdateLoading,
            isError: isUpdateError,
            error: updateError,
            data: updateData,
        },
    ] = useUpdateBrandMutation();
    const update = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateBrandPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Brand updated successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to update brand",
                    status: "error",
                });
            }
        });
    };

    // delete brand
    const [
        handleDelete,
        {
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            error: deleteError,
            data: deleteData,
        },
    ] = useDeleteBrandMutation();
    const deleteBrand = ({
        formData,
        onSuccess,
    }: {
        formData: DeleteBrandPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleDelete(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Brand deleted successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to delete brand",
                    status: "error",
                });
            }
        });
    };

    return {
        brands,
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
            submit: deleteBrand,
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            error: deleteError,
            data: deleteData,
        },
    };
};
export default useBrand;
