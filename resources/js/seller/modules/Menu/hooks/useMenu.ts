import { 
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useFetchMenusQuery
} from '../store/menuApi';
import { useAppSelector } from '../../../store/store';
import { CreateMenuPayload, UpdateMenuPayload, DeleteMenuPayload } from '../types';

const useMenu = () => {
  // Fetch menus
  useFetchMenusQuery();

  // Select menu state
  const { menus, meta } = useAppSelector((state) => state.menu);

  // Create menu
  const [
    handleCreate,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      error: createError,
      data: createData,
    },
  ] = useCreateMenuMutation();

  const create = ({
    formData,
    onSuccess,
  }: {
    formData: CreateMenuPayload;
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

  // Update menu
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateMenuMutation();

  const update = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateMenuPayload;
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

  // Delete menu
  const [
    handleDelete,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  ] = useDeleteMenuMutation();

  const deleteMenu = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteMenuPayload;
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
    menus,
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
      submit: deleteMenu,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  };
};

export default useMenu;