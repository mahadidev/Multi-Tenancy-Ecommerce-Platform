import useToast from "@seller/_hooks/useToast";
import { useAppDispatch, useAppSelector } from "@seller/store/store";
import {
    settingsApi,
    useChangePasswordMutation,
    useFetchGeneralSettingsQuery,
    useFetchProfileSettingsQuery,
    useFetchSocialMediaSettingsQuery,
    useResetSettingsMutation,
    useUpdateGeneralSettingsMutation,
    useUpdateProfileSettingsMutation,
    useUpdateSocialMediaSettingsMutation,
    useUploadAvatarMutation,
    useUploadLogoMutation,
} from "../store/settingsApi";
import {
    updateGeneralSettings,
    updateProfileSettings,
    updateSocialMediaSettings,
} from "../store/settingsSlice";
import {
    PasswordChangeType,
    UpdateGeneralSettingsPayload,
    UpdateProfileSettingsPayload,
    UpdateSocialMediaSettingsPayload,
    UploadAvatarPayload,
    UploadLogoPayload,
} from "../types";

const useSettings = () => {
    const dispatch = useAppDispatch();
    const { toaster } = useToast();

    // Fetch settings automatically
    useFetchGeneralSettingsQuery();
    useFetchProfileSettingsQuery();
    useFetchSocialMediaSettingsQuery();

    // Select settings state
    const {
        generalSettings,
        profileSettings,
        socialMediaSettings,
        isLoading,
        lastUpdated,
    } = useAppSelector((state) => state.settings);

    // Update General Settings
    const [
        handleUpdateGeneralSettings,
        {
            isLoading: isUpdateGeneralLoading,
            isError: isUpdateGeneralError,
            error: updateGeneralError,
            data: updateGeneralData,
        },
    ] = useUpdateGeneralSettingsMutation();

    const updateGeneral = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateGeneralSettingsPayload;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateGeneralSettings(formData).then((response) => {
            if (response.data?.status === 200) {
                dispatch(updateGeneralSettings(formData));
                toaster({
                    text: "General settings updated successfully",
                    status: "success",
                });
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                toaster({
                    text: "Failed to update general settings",
                    status: "error",
                });
            }
        });
    };

    // Update Profile Settings
    const [
        handleUpdateProfileSettings,
        {
            isLoading: isUpdateProfileLoading,
            isError: isUpdateProfileError,
            error: updateProfileError,
            data: updateProfileData,
        },
    ] = useUpdateProfileSettingsMutation();

    const updateProfile = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateProfileSettingsPayload;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateProfileSettings(formData).then((response) => {
            if (response.data?.status === 200) {
                dispatch(updateProfileSettings(formData));
                toaster({
                    text: "Profile settings updated successfully",
                    status: "success",
                });
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                toaster({
                    text: "Failed to update profile settings",
                    status: "error",
                });
            }
        });
    };

    // Update Social Media Settings
    const [
        handleUpdateSocialMediaSettings,
        {
            isLoading: isUpdateSocialMediaLoading,
            isError: isUpdateSocialMediaError,
            error: updateSocialMediaError,
            data: updateSocialMediaData,
        },
    ] = useUpdateSocialMediaSettingsMutation();

    const updateSocialMedia = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateSocialMediaSettingsPayload;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateSocialMediaSettings(formData).then((response) => {
            if (response.data?.status === 200) {
                dispatch(updateSocialMediaSettings(formData));
                toaster({
                    text: "Social media settings updated successfully",
                    status: "success",
                });
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                toaster({
                    text: "Failed to update social media settings",
                    status: "error",
                });
            }
        });
    };

    // Change Password
    const [
        handleChangePassword,
        {
            isLoading: isChangePasswordLoading,
            isError: isChangePasswordError,
            error: changePasswordError,
            data: changePasswordData,
        },
    ] = useChangePasswordMutation();

    const changePassword = ({
        formData,
        onSuccess,
    }: {
        formData: PasswordChangeType;
        onSuccess?: CallableFunction;
    }) => {
        handleChangePassword(formData).then((response) => {
            if (response.data?.status === 200) {
                toaster({
                    text: "Password changed successfully",
                    status: "success",
                });
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                toaster({
                    text: "Failed to change password",
                    status: "error",
                });
            }
        });
    };

    // Upload Avatar
    const [
        handleUploadAvatar,
        {
            isLoading: isUploadAvatarLoading,
            isError: isUploadAvatarError,
            error: uploadAvatarError,
            data: uploadAvatarData,
        },
    ] = useUploadAvatarMutation();

    const uploadAvatar = ({
        formData,
        onSuccess,
    }: {
        formData: UploadAvatarPayload;
        onSuccess?: CallableFunction;
    }) => {
        handleUploadAvatar(formData).then((response) => {
            if (response.data?.status === 200) {
                toaster({
                    text: "Avatar uploaded successfully",
                    status: "success",
                });
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                toaster({
                    text: "Failed to upload avatar",
                    status: "error",
                });
            }
        });
    };

    // Upload Logo
    const [
        handleUploadLogo,
        {
            isLoading: isUploadLogoLoading,
            isError: isUploadLogoError,
            error: uploadLogoError,
            data: uploadLogoData,
        },
    ] = useUploadLogoMutation();

    const uploadLogo = ({
        formData,
        onSuccess,
    }: {
        formData: UploadLogoPayload;
        onSuccess?: CallableFunction;
    }) => {
        handleUploadLogo(formData).then((response) => {
            if (response.data?.status === 200) {
                toaster({
                    text: `${formData.type} uploaded successfully`,
                    status: "success",
                });
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                toaster({
                    text: `Failed to upload ${formData.type}`,
                    status: "error",
                });
            }
        });
    };

    // Reset Settings
    const [
        handleResetSettings,
        {
            isLoading: isResetSettingsLoading,
            isError: isResetSettingsError,
            error: resetSettingsError,
            data: resetSettingsData,
        },
    ] = useResetSettingsMutation();

    const resetSettings = ({
        formData,
        onSuccess,
    }: {
        formData: { type: 'general' | 'profile' | 'social' };
        onSuccess?: CallableFunction;
    }) => {
        handleResetSettings(formData).then((response) => {
            if (response.data?.status === 200) {
                toaster({
                    text: `${formData.type} settings reset successfully`,
                    status: "success",
                });
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                toaster({
                    text: `Failed to reset ${formData.type} settings`,
                    status: "error",
                });
            }
        });
    };

    // Refetch functions
    const refetchGeneralSettings = () => {
        settingsApi.endpoints.fetchGeneralSettings.initiate();
    };

    const refetchProfileSettings = () => {
        settingsApi.endpoints.fetchProfileSettings.initiate();
    };

    const refetchSocialMediaSettings = () => {
        settingsApi.endpoints.fetchSocialMediaSettings.initiate();
    };

    return {
        // Settings data
        generalSettings,
        profileSettings,
        socialMediaSettings,
        isLoading,
        lastUpdated,

        // Update operations
        updateGeneral: {
            submit: updateGeneral,
            isLoading: isUpdateGeneralLoading,
            isError: isUpdateGeneralError,
            error: updateGeneralError,
            data: updateGeneralData,
        },
        updateProfile: {
            submit: updateProfile,
            isLoading: isUpdateProfileLoading,
            isError: isUpdateProfileError,
            error: updateProfileError,
            data: updateProfileData,
        },
        updateSocialMedia: {
            submit: updateSocialMedia,
            isLoading: isUpdateSocialMediaLoading,
            isError: isUpdateSocialMediaError,
            error: updateSocialMediaError,
            data: updateSocialMediaData,
        },

        // Other operations
        changePassword: {
            submit: changePassword,
            isLoading: isChangePasswordLoading,
            isError: isChangePasswordError,
            error: changePasswordError,
            data: changePasswordData,
        },
        uploadAvatar: {
            submit: uploadAvatar,
            isLoading: isUploadAvatarLoading,
            isError: isUploadAvatarError,
            error: uploadAvatarError,
            data: uploadAvatarData,
        },
        uploadLogo: {
            submit: uploadLogo,
            isLoading: isUploadLogoLoading,
            isError: isUploadLogoError,
            error: uploadLogoError,
            data: uploadLogoData,
        },
        resetSettings: {
            submit: resetSettings,
            isLoading: isResetSettingsLoading,
            isError: isResetSettingsError,
            error: resetSettingsError,
            data: resetSettingsData,
        },

        // Refetch functions
        refetchGeneralSettings,
        refetchProfileSettings,
        refetchSocialMediaSettings,
    };
};

export default useSettings;
