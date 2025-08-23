import { 
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useFetchProductVariantsQuery
} from '../store/productVariantApi';
import { useAppSelector } from '../../../store/store';
import { 
  CreateProductVariantPayload, 
  UpdateProductVariantPayload, 
  DeleteProductVariantPayload 
} from '../types';

const useProductVariant = (productId: number | string) => {
  // Fetch product variants
  useFetchProductVariantsQuery({
    productId: productId,
  });

  // Select variant state
  const {
    variants,
    selectedVariant,
    meta,
  } = useAppSelector((state) => state.productVariant);

  // Create variant
  const [
    handleCreate,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      isSuccess: isCreateSuccess,
      error: createError,
      data: createData,
    },
  ] = useCreateProductVariantMutation();

  const create = ({
    formData,
    onSuccess,
  }: {
    formData: CreateProductVariantPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreate({ ...formData }).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Update variant
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      isSuccess: isUpdateSuccess,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateProductVariantMutation();

  const update = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateProductVariantPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdate({ ...formData }).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Delete variant
  const [
    handleDelete,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      isSuccess: isDeleteSuccess,
      error: deleteError,
      data: deleteData,
    },
  ] = useDeleteProductVariantMutation();

  const deleteVariant = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteProductVariantPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleDelete({ ...formData }).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  return {
    variants,
    selectedVariant,
    meta,

    create: {
      submit: create,
      isLoading: isCreateLoading,
      isError: isCreateError,
      error: createError,
      data: createData,
      isSuccess: isCreateSuccess,
    },
    update: {
      submit: update,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
      isSuccess: isUpdateSuccess,
    },
    delete: {
      submit: deleteVariant,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
      isSuccess: isDeleteSuccess,
    },
  };
};

export default useProductVariant;