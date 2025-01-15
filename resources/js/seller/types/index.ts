export interface LogoType {
    primary: string | null;
    dark: string | null;
}

export interface SocialMediaType {
    name: string;
    label: string;
    username: string;
}

export interface SettingsType {
    social_media?: SocialMediaType[];
}

export interface StoreType {
    id: number | string;
    name: string;
    slug: string;
    domain: string;
    email: string | null;
    phone: string | null;
    location: string | null;
    status: 1 | 0;
    type: string;
    description: string | null;
    currency: string;
    logos: LogoType;
    primary_color: null | string;
    secondary_color: null | string;
    theme_id: number;
    settings: SettingsType | null;
    created_at: string;
    updated_at: string;
}

export interface WidgetInputType {
    name: string;
    label: string;
    placeholder?: string;
    value?: string;
    required: boolean;
    type: "array" | "text" | "image" | "file" | "textarea" | "email" | "tel";
    items?: WidgetInputType[] | WidgetInputType[][];
}

export interface WidgetType {
    id: number;
    name: string;
    label: string;
    inputs: WidgetInputType[];
}

export interface StorePageType {
    id: number;
    name: string;
    type: string | "home" | "about" | "blog" | "contact";
    slug: string;
    title: string;
    is_active: 0 | 1;
    created_at: string;
    updated_at: string;
    widgets: WidgetType[];
}

export interface ThemeType {
    id: number;
    name: string;
    slug: string;
    thumbnail: string | null;
    widgets: WidgetType[];
}
