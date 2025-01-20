export interface SocialMediaType {
    id: string;
    name: string;
    label: string;
    username: string;
    url: string;
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
    logo: string;
    dark_logo?: string;
    primary_color: null | string;
    secondary_color: null | string;
    theme_id: number;
    settings: SettingsType | null;
    social_media: SocialMediaType[];
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
    type:
        | "text"
        | "image"
        | "file"
        | "textarea"
        | "email"
        | "tel"
        | "array"
        | "color";
}
export interface WidgetInputType {
    id: number;
    name: string;
    label: string;
    placeholder?: string;
    value?: string;
    required?: boolean;
    type:
        | "text"
        | "image"
        | "file"
        | "textarea"
        | "email"
        | "tel"
        | "array"
        | "color";
    items?: WidgetInputItemType[];
}

export interface WidgetType {
    id: number;
    store_page_id: number;
    name: string;
    label: string;
    created_at: string;
    updated_at: string;
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
    pages: StorePageType[];
}

export interface FileType {
    id: number;
    user_id: number;
    name: string;
    type: "image" | "pdf";
    response_type: "url" | "path";
    width: number;
    height: number;
    alternate_text: string;
    tags: string[];
    location: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface MetaType {
    current_page: number;
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    per_page: number;
}
