import useToast from '@seller/_hooks/useToast';
import { useAppSelector } from '@seller/store/store';
import {
    useCreateAdminMutation,
    useCreateStoreMutation,
    useDeleteAdminMutation,
    useFetchAdminsQuery,
    useFetchStoresQuery,
    useFetchStoreTypesQuery,
    useSwitchStoreMutation,
    useSwitchThemeMutation,
    useUpdateAdminMutation,
    useUpdateStoreMutation,
} from '../store/storeApi';
import {
    CreateStoreAdminPayload,
    UpdateStoreAdminPayload,
    DeleteStoreAdminPayload,
    CreateStorePayload,
    UpdateStorePayload,
    SwitchStorePayload,
    SwitchThemePayload,
} from '../types';

const useStore = () => {
  // fetch stores, types, and admins
  useFetchStoresQuery();
  useFetchStoreTypesQuery();
  useFetchAdminsQuery();

  // show toast message
  const { toaster } = useToast();

  // select store
  const { store, stores, storeTypes, currentStore, admins } = useAppSelector(
    (state) => state.store
  );

  // create store
  const [
    handleCreate,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      error: createError,
      data: createData,
    },
  ] = useCreateStoreMutation();
  const create = ({
    formData,
    onSuccess,
  }: {
    formData: CreateStorePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreate(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        toaster({
          text: 'Store created successfully.',
          status: 'success',
        });
      } else {
        toaster({
          text: 'Failed to create store',
          status: 'error',
        });
      }
    });
  };

  // update store
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateStoreMutation();
  const update = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateStorePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdate(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        toaster({
          text: 'Store updated successfully.',
          status: 'success',
        });
      } else {
        toaster({
          text: 'Failed to update store',
          status: 'error',
        });
      }
    });
  };

  // switch store
  const [
    handleSwitchStore,
    {
      isLoading: isSwitchStoreLoading,
      isError: isSwitchStoreError,
      error: switchStoreError,
      data: switchStoreData,
    },
  ] = useSwitchStoreMutation();
  const switchStore = ({
    formData,
    onSuccess,
  }: {
    formData: SwitchStorePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleSwitchStore(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      } else {
        toaster({
          text: 'Failed to switch store',
          status: 'error',
        });
      }
    });
  };

  // active theme
  const [
    handleActiveTheme,
    {
      isLoading: isActiveThemeLoading,
      isError: isActiveThemeError,
      error: activeThemeError,
      data: activeThemeData,
    },
  ] = useSwitchThemeMutation();
  const activeTheme = ({
    formData,
    onSuccess,
  }: {
    formData: SwitchThemePayload;
    onSuccess?: CallableFunction;
  }) => {
    if (store) {
      handleActiveTheme({
        theme_id: formData.theme_id,
        store_id: store.id,
        import_demo: formData.import_demo
      }).then((response) => {
        if (response.data?.status === 200) {
          if (onSuccess) {
            onSuccess(response.data.data);
          }
          toaster({
            text: 'Theme activated successfully.',
            status: 'success',
          });
        } else {
          toaster({
            text: 'Failed to activate theme',
            status: 'error',
          });
        }
      });
    }
  };

  // deactive theme
  const [
    handleDeactiveTheme,
    {
      isLoading: isDeactiveThemeLoading,
      isError: isDeactiveThemeError,
      error: deactiveThemeError,
      data: deactiveThemeData,
    },
  ] = useSwitchThemeMutation();
  const deactiveTheme = ({ onSuccess }: { onSuccess?: CallableFunction }) => {
    if (store) {
      handleDeactiveTheme({
        store_id: store.id,
        theme_id: null,
        import_demo: false,
      }).then((response) => {
        if (response.data?.status === 200) {
          if (onSuccess) {
            onSuccess(response.data.data);
          }

          toaster({
            text: 'Theme deactivated successfully.',
            status: 'success',
          });
        } else {
          toaster({
            text: 'Failed to deactivate theme',
            status: 'error',
          });
        }
      });
    }
  };

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
    formData: CreateStoreAdminPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreateAdmin(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        toaster({
          text: "Admin created successfully",
          status: "success",
        });
      } else {
        toaster({
          text: "Failed to create admin",
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
    formData: UpdateStoreAdminPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdateAdmin(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        toaster({
          text: "Admin updated successfully",
          status: "success",
        });
      } else {
        toaster({
          text: "Failed to update admin",
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
    formData: DeleteStoreAdminPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleDeleteAdmin(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        toaster({
          text: "Admin deleted successfully",
          status: "success",
        });
      } else {
        toaster({
          text: "Failed to delete admin",
          status: "error",
        });
      }
    });
  };

  return {
    store,
    stores,
    storeTypes,
    currentStore,
    admins,
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
    switchStore: {
      submit: switchStore,
      isLoading: isSwitchStoreLoading,
      isError: isSwitchStoreError,
      error: switchStoreError,
      data: switchStoreData,
    },
    activeTheme: {
      submit: activeTheme,
      isLoading: isActiveThemeLoading,
      isError: isActiveThemeError,
      error: activeThemeError,
      data: activeThemeData,
    },
    deactiveTheme: {
      submit: deactiveTheme,
      isLoading: isDeactiveThemeLoading,
      isError: isDeactiveThemeError,
      error: deactiveThemeError,
      data: deactiveThemeData,
    },
    createAdmin: {
      submit: createAdmin,
      isLoading: isCreateAdminLoading,
      isError: isCreateAdminError,
      error: createAdminError,
      data: createAdminData,
    },
    updateAdmin: {
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

export default useStore;
