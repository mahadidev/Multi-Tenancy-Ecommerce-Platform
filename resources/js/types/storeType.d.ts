import { BrandType } from "./brandType";
import { CategoryType } from "./categoryType";
import { MenuType } from "./menuType";
import { PageType } from "./pageType";
import { ProductType } from "./productType";
import { ThemeType } from "./themeType";
import { WidgetType } from "./widgetType";

export interface SettingsType {
    social_media?: SocialMediaType[];
}

export interface StoreType {
    id: number;
    name: string;
    slug: string;
    domain: string;
    email: string | null;
    phone: string | null;
    location: string | null;
    status: 1 | 0;
    type: string;
    store_type: StoreTypesType;
    description: string | null;
    store_subscription_status: string;
    store_subscription_plan: StoreSubscriptionPlanType;
    currency: string;
    logo: string;
    dark_logo: string | null;
    primary_color: null | string;
    secondary_color: null | string;
    theme_id: number;
    categories: CategoryType[];
    pages: PageType[];
    theme: null | ThemeType;
    settings: SettingsType | null;
    social_media: SocialMediaType[];
    storeProducts: ProductType[];
    featuredProducts: StoreProduct[];
    trendingProducts: ProductType[];
    brands: BrandType[];
    widgets: WidgetType[];
    menus: MenuType[];
    website?: WebsiteType | null;
    created_at: string;
    updated_at: string;
}

export interface StoreSubscriptionPlanType {
    id: number;
    start_date: string;
    end_date: string;
    is_active: number;
    package: PackageType;
}

export interface PackageType {
    id: number;
    name: string;
    title: string;
    is_trend: number;
    is_visible: number;
    trial_days: number;
    price_monthly: string;
}

export interface StoreTypeData {
    store_types: StoreTypesType[];
}

export interface StoreTypesType {
    id: number;
    label: string;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface WebsiteType {
    id: number;
    subdomain: string;
    domain?: string | null;
    title: string;
    description?: string | null;
    is_published: boolean;
    is_maintenance_mode: boolean;
}
