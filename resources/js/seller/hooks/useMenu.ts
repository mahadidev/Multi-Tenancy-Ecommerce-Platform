import {
    useAddMenuMutation,
    useFetchMenusQuery,
    useRemoveMenuMutation,
    useUpdateMenuMutation,
} from "@seller/store/reducers/menuApi";
import { useAppSelector } from "@seller/store/store";
import { MenuIdType, MenuType } from "@type/menuType";
import useToast from "./useToast";

const useMenu = () => {
    useFetchMenusQuery();

    // toast hook
    const { toaster } = useToast();

    // select menu items
    const { menus } = useAppSelector((state) => state.menu);

    // add menu
    const [
        handleAddMenu,
        {
            isLoading: isAddMenuLoading,
            isError: isAddMenuError,
            error: addMenuError,
            data: addMenuData,
        },
    ] = useAddMenuMutation();
    const addMenu = ({
        formData,
        onSuccess,
    }: {
        formData: MenuType;
        onSuccess?: CallableFunction;
    }) => {
        handleAddMenu(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Menu added successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to add menu",
                    status: "error",
                });
            }
        });
    };

    // update menu
    const [
        handleUpdateMenu,
        {
            isLoading: isUpdateMenuLoading,
            isError: isUpdateMenuError,
            error: updateMenuError,
            data: updateMenuData,
        },
    ] = useUpdateMenuMutation();

    const updateMenu = ({
        formData,
        onSuccess,
    }: {
        formData: MenuType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateMenu(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Menu updated successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed update menu",
                    status: "error",
                });
            }
        });
    };

    // remove menu
    const [
        handleRemoveMenu,
        {
            isLoading: isRemoveMenuLoading,
            isError: isRemoveMenuError,
            error: removeMenuError,
            data: removeMenuData,
        },
    ] = useRemoveMenuMutation();
    const removeMenu = ({
        formData,
        onSuccess,
    }: {
        formData: MenuIdType;
        onSuccess?: CallableFunction;
    }) => {
        handleRemoveMenu(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Menu removed successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed remove menu",
                    status: "error",
                });
            }
        });
    };

    return {
        menus,
        create: {
            submit: addMenu,
            isLoading: isAddMenuLoading,
            isError: isAddMenuError,
            error: addMenuError,
            data: addMenuData,
        },

        update: {
            submit: updateMenu,
            isLoading: isUpdateMenuLoading,
            isError: isUpdateMenuError,
            error: updateMenuError,
            data: updateMenuData,
        },

        delete: {
            submit: removeMenu,
            isLoading: isRemoveMenuLoading,
            isError: isRemoveMenuError,
            error: removeMenuError,
            data: removeMenuData,
        },
    };
};
export default useMenu;
