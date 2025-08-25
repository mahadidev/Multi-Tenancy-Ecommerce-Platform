// Generic table types for reusable table components

export interface ServerTableFilters {
	page?: number;
	per_page?: number;
	search?: string;
	sort_by?: string;
	sort_order?: 'asc' | 'desc';
	[key: string]: any; // Allow additional filters
}

export interface ServerTableMeta {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	from?: number;
	to?: number;
	first_page_url?: string;
	last_page_url?: string;
	next_page_url?: string | null;
	prev_page_url?: string | null;
}

export interface GenericApiResponse<T> {
	data: {
		[key: string]: T[]; // e.g., { categories: Category[], products: Product[] }
	};
	meta?: ServerTableMeta;
	status?: string;
	message?: string;
}

export interface UseGenericTableProps<TFilters extends ServerTableFilters> {
	initialFilters?: Partial<TFilters>;
	defaultSortBy?: string;
	defaultSortOrder?: 'asc' | 'desc';
	defaultPerPage?: number;
	searchableColumns?: string[];
}

export interface UseGenericTableReturn<TData, TFilters extends ServerTableFilters> {
	data: TData[];
	meta: ServerTableMeta | null;
	filters: TFilters;
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	error: any;
	refetch: () => void;
	// Table actions
	onPageChange: (page: number) => void;
	onSort: (sortBy: string) => void;
	onSearch: (searchValue: string) => void;
	onPerPageChange: (perPage: number) => void;
	onFilterChange: (key: string, value: any) => void;
	resetFilters: () => void;
	updateFilters: (newFilters: Partial<TFilters>) => void;
	// Search state
	searchQuery: string;
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	currentSort: {
		key?: string;
		dir?: 'asc' | 'desc';
	};
}