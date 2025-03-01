export interface WidgetInputTypeType {
	id: number;
	type:
		| string
		| 'array'
		| 'text'
		| 'image'
		| 'file'
		| 'email'
		| 'number'
		| 'options';
	label: string;

	created_at: string;
	updated_at: string;
}

export interface WidgetInputType {
	id: number;
	parent_id: null | number;
	name: string;
	label: string;
	placeholder?: string;
	value?: string;
	serial: number;
	widget_id?: number;
	required?: boolean;
	type: WidgetInputTypeType;
	child?: WidgetInputType[];
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
