import { useAppSelector } from "@/seller/store";
import {
    UpdateStorePayloadType,
    useUpdateStoreMutation,
} from "@/seller/store/reducers/storeApi";
import { SocialMediaType, StoreType } from "@/seller/types";
import {
    StoreSocialMediaPayloadType,
    useDeleteSocialMediaMutation,
    useStoreSocialMediaMutation,
} from "../store/reducers/socialMediaApi";

const useStore = () => {
    const { currentStore } = useAppSelector((state) => state.store);
    const store: StoreType = currentStore;

    const [onUpdate, { isLoading: isUpdateLoading, error: updateError }] =
        useUpdateStoreMutation();
    const [
        onActiveTheme,
        { isLoading: isThemeActiveLoading, error: themeActiveError },
    ] = useUpdateStoreMutation();
    const [
        onDeActiveTHeme,
        { isLoading: isThemeDeActiveLoading, error: themeDeActiveError },
    ] = useUpdateStoreMutation();
    const [
        onAddSocialMedia,
        { isLoading: isAddSocialMediaLoading, error: addSocialMediaError },
    ] = useStoreSocialMediaMutation();
    const [
        onRemoveSocialMedia,
        {
            isLoading: isRemoveSocialMediaLoading,
            error: removeSocialMediaError,
        },
    ] = useDeleteSocialMediaMutation();
    const [
        onResetSettings,
        { isLoading: isResetSettingsLoading, error: resetSettingsError },
    ] = useUpdateStoreMutation();

    const updateStore = ({
        storeData,
    }: {
        storeData: UpdateStorePayloadType;
    }) => {
        onUpdate({
            storeId: store.id,
            formData: storeData,
        });
    };

    const activeTheme = (theme_id: number | "none") => {
        onActiveTheme({
            storeId: store.id,
            formData: {
                theme_id: theme_id,
            },
        });
    };

    const deActiveTheme = () => {
        onDeActiveTHeme({
            storeId: store.id,
            formData: {
                theme_id: "none",
            },
        });
    };

    const addSocialMedia = ({
        formData,
        onSuccess,
    }: {
        formData: StoreSocialMediaPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        onAddSocialMedia({
            formData: formData,
        }).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    const removeSocialMedia = ({
        formData,
        onSuccess,
    }: {
        formData: SocialMediaType;
        onSuccess?: CallableFunction;
    }) => {
        onRemoveSocialMedia({
            socialMediaId: formData.id,
        }).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    const resetSettings = ({ onSuccess }: { onSuccess?: CallableFunction }) => {
        onResetSettings({
            storeId: store.id,
            formData: {
                settings: {
                    social_media: [],
                },
            },
        }).then((response) => {
            if (response.data.status) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    return {
        updateStore: {
            update: updateStore,
            loading: isUpdateLoading,
            error: updateError,
        },
        activeTheme: {
            active: activeTheme,
            loading: isThemeActiveLoading,
            error: themeActiveError,
        },
        deActiveTheme: {
            deactive: deActiveTheme,
            loading: isThemeDeActiveLoading,
            error: themeDeActiveError,
        },
        addSocialMedia: {
            add: addSocialMedia,
            loading: isAddSocialMediaLoading,
            error: addSocialMediaError,
        },
        removeSocialMedia: {
            remove: removeSocialMedia,
            loading: isRemoveSocialMediaLoading,
            error: removeSocialMediaError,
        },
        resetSettings: {
            reset: resetSettings,
            loading: isResetSettingsLoading,
            error: resetSettingsError,
        },
        store: store,
    };
};

export default useStore;
