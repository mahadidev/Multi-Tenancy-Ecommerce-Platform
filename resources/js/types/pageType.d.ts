import { WidgetType } from "./widgetType";

export interface PageTypeType {
	id: number;
	label: string;
	type: string;
	created_at: string;
	updated_at: string;
}

export interface PageType {
	id: number;
	name: string;
	slug: string;
	title: string;
	theme_id?: number;
	is_active: 0 | 1;
	widgets: WidgetType[];
	type: PageTypeType;
	layout: WidgetType | null;
	created_at: string;
	updated_at: string;
}
