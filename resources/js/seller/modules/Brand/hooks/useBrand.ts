import { 
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useFetchBrandsQuery
} from '../store/brandApi';
import { useAppSelector } from '../../../store/store';
import { CreateBrandPayload, UpdateBrandPayload, DeleteBrandPayload } from '../types';

const useBrand = () => {
  // Fetch brands
  useFetchBrandsQuery();

  // Select brand state
  const {
    brands,
    meta,
  } = useAppSelector((state) => state.brand);

  // Create brand
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
    formData: CreateBrandPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreate(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Update brand
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
    formData: UpdateBrandPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdate(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Delete brand
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
    formData: DeleteBrandPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleDelete(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
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