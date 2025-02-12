import { PageType } from "./pageType";
import { StoreType } from "./storeType";
import { ThemeHooksType } from "./themeHooksType";
import { WidgetType } from "./widgetType";


export interface ThemeType {
	id: number;
	name: string;
	slug: string;
	thumbnail: string | null;
	widgets: WidgetType[];
	pages: PageType[];
}

export interface ThemeWidgetPropsType {
	widget: WidgetType;
	store: StoreType;
	hooks?: ThemeHooksType;
}

export interface ThemeLayoutPropsType {
	store: StoreType;
	hooks?: ThemeHooksType;
	layout: WidgetType;
}
