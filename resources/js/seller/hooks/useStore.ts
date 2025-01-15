import { useAppSelector } from "@/seller/store";
import {
    UpdateStorePayloadType,
    useUpdateStoreMutation,
} from "@/seller/store/reducers/storeApi";
import { SocialMediaType, StoreType } from "@/seller/types";

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
    ] = useUpdateStoreMutation();
    const [
        onRemoveSocialMedia,
        {
            isLoading: isRemoveSocialMediaLoading,
            error: removeSocialMediaError,
        },
    ] = useUpdateStoreMutation();
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
        socialMedia,
        onSuccess,
    }: {
        socialMedia: SocialMediaType;
        onSuccess?: CallableFunction;
    }) => {
        onAddSocialMedia({
            storeId: store.id,
            formData: {
                settings: {
                    ...store.settings,
                    social_media: [
                        ...(store.settings && store.settings.social_media
                            ? store.settings.social_media
                            : []),
                        socialMedia,
                    ],
                },
            },
        }).then((response) => {
            if (response.data.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    const removeSocialMedia = ({
        socialMedia,
        onSuccess,
    }: {
        socialMedia: SocialMediaType;
        onSuccess?: CallableFunction;
    }) => {
        onRemoveSocialMedia({
            storeId: store.id,
            formData: {
                settings: {
                    ...store.settings,
                    social_media: [
                        ...(store.settings && store.settings.social_media
                            ? store.settings.social_media.filter(
                                  (item) => item.name !== socialMedia.name
                              )
                            : []),
                    ],
                },
            },
        }).then((response) => {
            if (response.data.status === 200) {
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
