import { PageType } from "./pageType";
import { WidgetType } from "./widgetType";


export interface ThemeType {
	id: number;
	name: string;
	slug: string;
	thumbnail: string | null;
	widgets: WidgetType[];
	pages: PageType[];
}
