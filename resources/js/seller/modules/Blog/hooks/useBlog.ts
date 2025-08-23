import { 
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useFetchBlogsQuery
} from '../store/blogApi';
import { useAppSelector } from '../../../store/store';
import { CreateBlogPayload, UpdateBlogPayload, DeleteBlogPayload } from '../types';

const useBlog = () => {
  // Fetch blogs
  useFetchBlogsQuery();

  // Select blog state
  const {
    blogs,
    meta,
  } = useAppSelector((state) => state.blog);

  // Create blog
  const [
    handleCreate,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      error: createError,
      data: createData,
    },
  ] = useCreateBlogMutation();

  const create = ({
    formData,
    onSuccess,
  }: {
    formData: CreateBlogPayload;
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

  // Update blog
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateBlogMutation();

  const update = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateBlogPayload;
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

  // Delete blog
  const [
    handleDelete,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  ] = useDeleteBlogMutation();

  const deleteBlog = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteBlogPayload;
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
    blogs,
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
      submit: deleteBlog,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  };
};

export default useBlog;