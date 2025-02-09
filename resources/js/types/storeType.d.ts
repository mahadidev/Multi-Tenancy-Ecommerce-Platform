import { CategoryType } from "./categoryType";
import { PageType } from "./pageType";
import { ProductType } from "./productType";
import { ThemeType } from "./themeType";


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
	description: string | null;
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
    featuredProducts?: ProductType[];
	created_at: string;
	updated_at: string;
}
