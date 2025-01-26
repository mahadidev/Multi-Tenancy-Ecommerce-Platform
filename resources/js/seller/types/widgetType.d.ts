export interface WidgetInputItemType {
	id: number;
	name: string;
	label: string;
	placeholder?: string;
	value: string;
	required: boolean;
	widget_input_id: number;
	type:
		| 'text'
		| 'image'
		| 'file'
		| 'textarea'
		| 'email'
		| 'tel'
		| 'array'
		| 'color';
}
export interface WidgetInputType {
	id: number;
	name: string;
	label: string;
	placeholder?: string;
	value?: string;
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
