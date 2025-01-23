import { WidgetType } from "./widgetType";

export interface PageTypeType {
	id: number;
	label: string;
	type: string;
}

export interface PageType {
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
