import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    SettingsState,
    GeneralSettingsType,
    ProfileSettingsType,
    SocialMediaSettingsType,
} from "../types";

const initialState: SettingsState = {
    generalSettings: {
        site_name: '',
        site_description: '',
        site_logo: '',
        site_favicon: '',
        default_timezone: 'UTC',
        default_currency: 'USD',
        date_format: 'Y-m-d',
        time_format: 'H:i:s',
        admin_email: '',
        maintenance_mode: false,
        allow_registration: true,
    },
    profileSettings: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        avatar: '',
        bio: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
    },
    socialMediaSettings: {
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        linkedin_url: '',
        youtube_url: '',
        tiktok_url: '',
        pinterest_url: '',
        whatsapp_number: '',
        telegram_username: '',
    },
    isLoading: false,
    lastUpdated: null,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setGeneralSettings: (state, action: PayloadAction<GeneralSettingsType>) => {
            state.generalSettings = action.payload;
            state.lastUpdated = new Date().toISOString();
        },

        updateGeneralSettings: (state, action: PayloadAction<Partial<GeneralSettingsType>>) => {
            state.generalSettings = { ...state.generalSettings, ...action.payload };
            state.lastUpdated = new Date().toISOString();
        },

        setProfileSettings: (state, action: PayloadAction<ProfileSettingsType>) => {
            state.profileSettings = action.payload;
            state.lastUpdated = new Date().toISOString();
        },

        updateProfileSettings: (state, action: PayloadAction<Partial<ProfileSettingsType>>) => {
            state.profileSettings = { ...state.profileSettings, ...action.payload };
            state.lastUpdated = new Date().toISOString();
        },

        setSocialMediaSettings: (state, action: PayloadAction<SocialMediaSettingsType>) => {
            state.socialMediaSettings = action.payload;
            state.lastUpdated = new Date().toISOString();
        },

        updateSocialMediaSettings: (state, action: PayloadAction<Partial<SocialMediaSettingsType>>) => {
            state.socialMediaSettings = { ...state.socialMediaSettings, ...action.payload };
            state.lastUpdated = new Date().toISOString();
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        clearSettings: (state) => {
            state.generalSettings = initialState.generalSettings;
            state.profileSettings = initialState.profileSettings;
            state.socialMediaSettings = initialState.socialMediaSettings;
            state.lastUpdated = null;
        },

        resetGeneralSettings: (state) => {
            state.generalSettings = initialState.generalSettings;
            state.lastUpdated = new Date().toISOString();
        },

        resetProfileSettings: (state) => {
            state.profileSettings = initialState.profileSettings;
            state.lastUpdated = new Date().toISOString();
        },

        resetSocialMediaSettings: (state) => {
            state.socialMediaSettings = initialState.socialMediaSettings;
            state.lastUpdated = new Date().toISOString();
        },
    },
});

export const {
    setGeneralSettings,
    updateGeneralSettings,
    setProfileSettings,
    updateProfileSettings,
    setSocialMediaSettings,
    updateSocialMediaSettings,
    setLoading,
    clearSettings,
    resetGeneralSettings,
    resetProfileSettings,
    resetSocialMediaSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;