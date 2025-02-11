export interface WidgetInputItemType {
	id: number;
	name: string;
	label: string;
	placeholder?: string;
	value: string;
	widget_input_id: number;
	required: boolean;
	type:
		| 'text'
		| 'image'
		| 'file'
		| 'textarea'
		| 'email'
		| 'tel'
		| 'array'
		| 'color';
	created_at: string;
	updated_at: string;
}
export interface WidgetInputType {
	id: number;
	name: string;
	label: string;
	placeholder?: string;
	value?: string;
	serial: number;
	widget_id?: number;
	required?: boolean;
	type:
		| 'text'
		| 'image'
		| 'file'
		| 'textarea'
		| 'email'
		| 'tel'
		| 'array'
		| 'color';
	items?: WidgetInputItemType[];
	created_at: string;
	updated_at: string;
}

export interface WidgetTypeType {
	id: number;
	type: 'layout' | 'section' | 'layout-widget';
	label: string;
	created_at: string;
	updated_at: string;
}

export interface WidgetType {
	id: number;
	store_page_id?: number;
	theme_id?: number;
	store_id?: number;
	theme_page_id?: number;
	is_editable: boolean;
	type: WidgetTypeType;
	name: string;
	label: string;
	serial: number;
	created_at: string;
	updated_at: string;
	inputs: WidgetInputType[];
}
