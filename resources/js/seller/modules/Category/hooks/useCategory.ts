import { 
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchProductCategoriesQuery,
  useFetchBlogCategoriesQuery
} from '../store/categoryApi';
import { useAppSelector } from '../../../store/store';
import { CreateCategoryPayload, UpdateCategoryPayload, DeleteCategoryPayload } from '../types';

const useCategory = () => {
  // Fetch Categories (using backward compatible hooks)
  useFetchProductCategoriesQuery();

  // Fetch blog categories  
  useFetchBlogCategoriesQuery();

  // Select category state
  const {
    categories,
    blogCategories,
    productCategories,
    categoriesMeta,
    blogCategoriesMeta,
    productCategoriesMeta,
  } = useAppSelector((state) => state.category);

  // Create category
  const [
    handleCreate,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      error: createError,
      data: createData,
    },
  ] = useCreateCategoryMutation();

  const create = ({
    formData,
    onSuccess,
  }: {
    formData: CreateCategoryPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreate(formData).then((response: any) => {
      if ('data' in response && response.data) {
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    });
  };

  // Update category
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateCategoryMutation();

  const update = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateCategoryPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdate(formData).then((response: any) => {
      if ('data' in response && response.data) {
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    });
  };

  // Delete category
  const [
    handleDelete,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  ] = useDeleteCategoryMutation();

  const deleteCategory = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteCategoryPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleDelete(formData).then((response: any) => {
      if ('data' in response && response.data) {
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
    });
  };

  return {
    categories,
    blogCategories,
    productCategories,
    categoriesMeta,
    blogCategoriesMeta,
    productCategoriesMeta,

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
      submit: deleteCategory,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  };
};

export default useCategory;