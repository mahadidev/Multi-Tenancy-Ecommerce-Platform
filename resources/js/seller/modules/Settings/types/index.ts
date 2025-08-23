// Settings Module Types
export interface GeneralSettingsType {
    site_name: string;
    site_description: string;
    site_logo: string;
    site_favicon: string;
    default_timezone: string;
    default_currency: string;
    date_format: string;
    time_format: string;
    admin_email: string;
    maintenance_mode: boolean;
    allow_registration: boolean;
}

export interface ProfileSettingsType {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
}

export interface SocialMediaSettingsType {
    facebook_url: string;
    twitter_url: string;
    instagram_url: string;
    linkedin_url: string;
    youtube_url: string;
    tiktok_url: string;
    pinterest_url: string;
    whatsapp_number: string;
    telegram_username: string;
}

export interface PasswordChangeType {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export interface SettingsState {
    generalSettings: GeneralSettingsType;
    profileSettings: ProfileSettingsType;
    socialMediaSettings: SocialMediaSettingsType;
    isLoading: boolean;
    lastUpdated: string | null;
}

export interface UpdateGeneralSettingsPayload extends Partial<GeneralSettingsType> {}
export interface UpdateProfileSettingsPayload extends Partial<ProfileSettingsType> {}
export interface UpdateSocialMediaSettingsPayload extends Partial<SocialMediaSettingsType> {}

export interface UploadAvatarPayload {
    file: File;
}

export interface UploadLogoPayload {
    file: File;
    type: 'logo' | 'favicon';
}