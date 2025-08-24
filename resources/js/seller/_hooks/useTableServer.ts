import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Generic interface for server-side table filters
export interface ServerTableFilters {
	page?: number;
	per_page?: number;
	search?: string;
	sort_by?: string;
	sort_order?: 'asc' | 'desc';
	[key: string]: any; // Allow additional filters
}

// Generic interface for server-side table meta data
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

// Props for the hook
interface UseTableServerProps {
	initialFilters?: ServerTableFilters;
	defaultSortBy?: string;
	defaultSortOrder?: 'asc' | 'desc';
	defaultPerPage?: number;
	searchableColumns?: string[];
	onFiltersChange?: (filters: ServerTableFilters) => void;
}

const useTableServer = ({
	initialFilters = {},
	defaultSortBy = 'created_at',
	defaultSortOrder = 'desc',
	defaultPerPage = 10,
	searchableColumns,
	onFiltersChange
}: UseTableServerProps) => {
	const [searchParams, setSearchParams] = useSearchParams();

	// Get filters from URL or use defaults
	const getFiltersFromURL = useCallback((): ServerTableFilters => {
		return {
			page: parseInt(searchParams.get('page') || '1', 10),
			per_page: parseInt(searchParams.get('per_page') || defaultPerPage.toString(), 10),
			search: searchParams.get('search') || '',
			sort_by: searchParams.get('sort_by') || defaultSortBy,
			sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || defaultSortOrder,
			...initialFilters
		};
	}, [searchParams, defaultSortBy, defaultSortOrder, defaultPerPage, initialFilters]);

	// State for current filters
	const [filters, setFilters] = useState<ServerTableFilters>(getFiltersFromURL);
	const [searchQuery, setSearchQuery] = useState(filters.search || '');

	// Update URL when filters change
	const updateURL = useCallback((newFilters: ServerTableFilters) => {
		const params = new URLSearchParams();

		Object.entries(newFilters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				// Only add non-default values to URL to keep it clean
				if (key === 'page' && value === 1) return;
				if (key === 'per_page' && value === defaultPerPage) return;
				if (key === 'search' && value === '') return;

				// Always include sort parameters to ensure they reach the API
				params.append(key, String(value));
			}
		});

		setSearchParams(params);
	}, [setSearchParams, defaultPerPage, defaultSortBy, defaultSortOrder]);

	// Update filters and trigger callback
	const updateFilters = useCallback((newFilters: Partial<ServerTableFilters>) => {
		const updatedFilters = {
			...filters,
			...newFilters
		};

		setFilters(updatedFilters);
		updateURL(updatedFilters);
		onFiltersChange?.(updatedFilters);
	}, [filters, updateURL, onFiltersChange]);

	// Handle page change
	const onPageChange = useCallback((page: number) => {
		updateFilters({ page });
	}, [updateFilters]);

	// Handle sort change
	const onSort = useCallback((sortBy: string) => {
		const currentSortBy = filters.sort_by;
		const currentSortOrder = filters.sort_order;

		let newSortOrder: 'asc' | 'desc';

		if (currentSortBy !== sortBy) {
			// Different column, start with desc
			newSortOrder = 'desc';
		} else if (currentSortOrder === 'desc') {
			// Same column, toggle to asc
			newSortOrder = 'asc';
		} else {
			// Same column asc, toggle to desc
			newSortOrder = 'desc';
		}

		updateFilters({
			sort_by: sortBy,
			sort_order: newSortOrder,
			page: 1 // Reset to first page when sorting
		});
	}, [filters.sort_by, filters.sort_order, updateFilters]);

	// Handle search
	const onSearch = useCallback((searchValue: string) => {
		setSearchQuery(searchValue);
		updateFilters({
			search: searchValue,
			page: 1 // Reset to first page when searching
		});
	}, [updateFilters]);

	// Handle per page change
	const onPerPageChange = useCallback((perPage: number) => {
		updateFilters({
			per_page: perPage,
			page: 1 // Reset to first page when changing page size
		});
	}, [updateFilters]);

	// Handle custom filter changes
	const onFilterChange = useCallback((key: string, value: any) => {
		updateFilters({
			[key]: value,
			page: 1 // Reset to first page when filtering
		});
	}, [updateFilters]);

	// Reset all filters
	const resetFilters = useCallback(() => {
		const resetFilters: ServerTableFilters = {
			page: 1,
			per_page: defaultPerPage,
			search: '',
			sort_by: defaultSortBy,
			sort_order: defaultSortOrder,
			...initialFilters
		};

		setFilters(resetFilters);
		setSearchQuery('');
		updateURL(resetFilters);
		onFiltersChange?.(resetFilters);
	}, [defaultPerPage, defaultSortBy, defaultSortOrder, initialFilters, updateURL, onFiltersChange]);

	// Current sort state for UI
	const currentSort = useMemo(() => ({
		key: filters.sort_by,
		dir: filters.sort_order
	}), [filters.sort_by, filters.sort_order]);

	// Sync URL changes back to state
	useEffect(() => {
		const urlFilters = getFiltersFromURL();
		setFilters(urlFilters);
		setSearchQuery(urlFilters.search || '');
	}, [searchParams, defaultSortBy, defaultSortOrder, defaultPerPage]);

	return {
		// Current state
		filters,
		searchQuery,
		currentSort,

		// Actions
		onPageChange,
		onSort,
		onSearch,
		onPerPageChange,
		onFilterChange,
		resetFilters,
		updateFilters,
		setSearchQuery,

		// For compatibility with existing components
		paginate: {
			currentPage: filters.page || 1,
			onNextPage: onPageChange,
		},
		sort: currentSort,
	};
};

export default useTableServer;
