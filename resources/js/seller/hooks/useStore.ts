import {
    CreateStorePayloadType,
    UpdateStorePayloadType,
    useCreateStoreMutation,
    useFetchStoresQuery,
    useUpdateStoreMutation,
} from "@seller/store/reducers/storeApi";
import { useAppSelector } from "@seller/store/store";
import useToast from "./useToast";

const useStore = () => {
    // fetch stores
    useFetchStoresQuery();

    // show toast message
    const { toaster } = useToast();

    // select store
    const { store, stores } = useAppSelector((state) => state.store);

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
        formData: CreateStorePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Store crated successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to create store",
                    status: "error",
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
        formData: UpdateStorePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Store updated successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to update store",
                    status: "error",
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
    ] = useUpdateStoreMutation();
    const activeTheme = ({
        formData,
        onSuccess,
    }: {
        formData: {
            theme_id: number;
        };
        onSuccess?: CallableFunction;
    }) => {
        if (store) {
            handleActiveTheme({
                id: store.id,
                theme_id: formData.theme_id,
            }).then((response) => {
                if (response.data?.status === 200) {
                    if (onSuccess) {
                        onSuccess(response.data.data);
                    }
                    toaster({
                        text: "Theme activate successfully.",
                        status: "success",
                    });
                } else {
                    toaster({
                        text: "Failed to activate theme",
                        status: "error",
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
    ] = useUpdateStoreMutation();
    const deactiveTheme = ({ onSuccess }: { onSuccess?: CallableFunction }) => {
        if (store) {
            handleDeactiveTheme({
                id: store.id,
                theme_id: "none",
            }).then((response) => {
                if (response.data?.status === 200) {
                    if (onSuccess) {
                        onSuccess(response.data.data);
                    }

                    toaster({
                        text: "Theme deactivate successfully.",
                        status: "success",
                    });
                } else {
                    toaster({
                        text: "Failed to deactivate theme",
                        status: "error",
                    });
                }
            });
        }
    };

    return {
        store,
        stores,
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
    };
};
export default useStore;
