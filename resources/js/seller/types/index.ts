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

export interface WidgetInputItemType {
    id: number;
    name: string;
    label: string;
    placeholder?: string;
    value: string;
    required: boolean;
    type: "text" | "image" | "file" | "textarea" | "email" | "tel";
}
export interface WidgetInputType {
    id: number;
    name: string;
    label: string;
    placeholder?: string;
    value?: string;
    required?: boolean;
    type: "text" | "image" | "file" | "textarea" | "email" | "tel" | "array";
    items?: WidgetInputItemType[];
}

export interface WidgetType {
    id: number;
    name: string;
    label: string;
    inputs: WidgetInputType[];
}

export interface PageTypeType {
    id: number;
    label: string;
    type: string;
}

export interface StorePageType {
    id: number;
    name: string;
    slug: string;
    title: string;
    is_active: 0 | 1;
    created_at: string;
    updated_at: string;
    widgets: WidgetType[];
    type: PageTypeType;
}

export interface ThemeType {
    id: number;
    name: string;
    slug: string;
    thumbnail: string | null;
    widgets: WidgetType[];
}
