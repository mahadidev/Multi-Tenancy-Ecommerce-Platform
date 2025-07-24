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

export interface DataTablePropsType {
	columns: {
		label?: string | ReactNode;
		key?: string;
		render?: CallableFunction;
		sortable?: boolean;
	}[];
	data: any[];
	search?: {
		columns: string[];
	};
}
