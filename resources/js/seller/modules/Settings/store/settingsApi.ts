import { createApi } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { baseQuery, createRequest } from "@seller/store/baseQueryWithReAuth";
import {
    setGeneralSettings,
    setProfileSettings,
    setSocialMediaSettings,
    setLoading,
} from "./settingsSlice";
import {
    GeneralSettingsType,
    ProfileSettingsType,
    SocialMediaSettingsType,
    UpdateGeneralSettingsPayload,
    UpdateProfileSettingsPayload,
    UpdateSocialMediaSettingsPayload,
    PasswordChangeType,
    UploadAvatarPayload,
    UploadLogoPayload,
} from "../types";

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: baseQuery,
    tagTypes: ["Settings", "GeneralSettings", "ProfileSettings", "SocialMediaSettings"],
    endpoints: (builder) => ({
        // Fetch General Settings
        fetchGeneralSettings: builder.query<
            { status: number; data: GeneralSettingsType },
            void
        >({
            query: () =>
                createRequest({
                    url: `${API_URL}/settings/general`,
                    method: "get",
                }),
            providesTags: ["GeneralSettings"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                await queryFulfilled.then((response) => {
                    dispatch(setGeneralSettings(response.data.data));
                    dispatch(setLoading(false));
                });
            },
        }),

        // Update General Settings
        updateGeneralSettings: builder.mutation<
            ApiResponseType,
            UpdateGeneralSettingsPayload
        >({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/settings/general`,
                    method: "put",
                    body: formData,
                }),
            invalidatesTags: ["GeneralSettings"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // Fetch Profile Settings
        fetchProfileSettings: builder.query<
            { status: number; data: ProfileSettingsType },
            void
        >({
            query: () =>
                createRequest({
                    url: `${API_URL}/settings/profile`,
                    method: "get",
                }),
            providesTags: ["ProfileSettings"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                await queryFulfilled.then((response) => {
                    dispatch(setProfileSettings(response.data.data));
                    dispatch(setLoading(false));
                });
            },
        }),

        // Update Profile Settings
        updateProfileSettings: builder.mutation<
            ApiResponseType,
            UpdateProfileSettingsPayload
        >({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/settings/profile`,
                    method: "put",
                    body: formData,
                }),
            invalidatesTags: ["ProfileSettings"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // Fetch Social Media Settings
        fetchSocialMediaSettings: builder.query<
            { status: number; data: SocialMediaSettingsType },
            void
        >({
            query: () =>
                createRequest({
                    url: `${API_URL}/settings/social-media`,
                    method: "get",
                }),
            providesTags: ["SocialMediaSettings"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                await queryFulfilled.then((response) => {
                    dispatch(setSocialMediaSettings(response.data.data));
                    dispatch(setLoading(false));
                });
            },
        }),

        // Update Social Media Settings
        updateSocialMediaSettings: builder.mutation<
            ApiResponseType,
            UpdateSocialMediaSettingsPayload
        >({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/settings/social-media`,
                    method: "put",
                    body: formData,
                }),
            invalidatesTags: ["SocialMediaSettings"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // Change Password
        changePassword: builder.mutation<ApiResponseType, PasswordChangeType>({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/settings/change-password`,
                    method: "put",
                    body: formData,
                }),
            invalidatesTags: ["Settings"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // Upload Avatar
        uploadAvatar: builder.mutation<ApiResponseType, UploadAvatarPayload>({
            query: (formData) => {
                const formDataObj = new FormData();
                formDataObj.append('avatar', formData.file);
                return createRequest({
                    url: `${API_URL}/settings/upload-avatar`,
                    method: "post",
                    body: formDataObj,
                });
            },
            invalidatesTags: ["ProfileSettings"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // Upload Logo/Favicon
        uploadLogo: builder.mutation<ApiResponseType, UploadLogoPayload>({
            query: (formData) => {
                const formDataObj = new FormData();
                formDataObj.append('file', formData.file);
                formDataObj.append('type', formData.type);
                return createRequest({
                    url: `${API_URL}/settings/upload-logo`,
                    method: "post",
                    body: formDataObj,
                });
            },
            invalidatesTags: ["GeneralSettings"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // Reset Settings
        resetSettings: builder.mutation<ApiResponseType, { type: 'general' | 'profile' | 'social' }>({
            query: (formData) =>
                createRequest({
                    url: `${API_URL}/settings/reset`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Settings", "GeneralSettings", "ProfileSettings", "SocialMediaSettings"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchGeneralSettingsQuery,
    useUpdateGeneralSettingsMutation,
    useFetchProfileSettingsQuery,
    useUpdateProfileSettingsMutation,
    useFetchSocialMediaSettingsQuery,
    useUpdateSocialMediaSettingsMutation,
    useChangePasswordMutation,
    useUploadAvatarMutation,
    useUploadLogoMutation,
    useResetSettingsMutation,
} = settingsApi;