import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { 
	ServerTableFilters, 
	ServerTableMeta, 
	GenericApiResponse,
	UseGenericTableProps,
	UseGenericTableReturn 
} from './types/table';

// Hook for managing generic table state and URL synchronization
export const useGenericTableFilters = <TFilters extends ServerTableFilters>({
	initialFilters = {},
	defaultSortBy = 'created_at',
	defaultSortOrder = 'desc',
	defaultPerPage = 10,
	searchableColumns
}: UseGenericTableProps<TFilters>) => {
	const [searchParams, setSearchParams] = useSearchParams();

	// Get filters from URL or use defaults
	const getFiltersFromURL = useCallback((): TFilters => {
		return {
			page: parseInt(searchParams.get('page') || '1', 10),
			per_page: parseInt(searchParams.get('per_page') || defaultPerPage.toString(), 10),
			search: searchParams.get('search') || '',
			sort_by: searchParams.get('sort_by') || defaultSortBy,
			sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || defaultSortOrder,
			...initialFilters
		} as TFilters;
	}, [searchParams, defaultSortBy, defaultSortOrder, defaultPerPage, initialFilters]);

	// State for current filters
	const [filters, setFilters] = useState<TFilters>(getFiltersFromURL);
	const [searchQuery, setSearchQuery] = useState(filters.search || '');

	// Update URL when filters change
	const updateURL = useCallback((newFilters: TFilters) => {
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
	}, [setSearchParams, defaultPerPage]);

	// Update filters
	const updateFilters = useCallback((newFilters: Partial<TFilters>) => {
		const updatedFilters = {
			...filters,
			...newFilters
		} as TFilters;
		
		setFilters(updatedFilters);
		updateURL(updatedFilters);
	}, [filters, updateURL]);

	// Handle page change
	const onPageChange = useCallback((page: number) => {
		updateFilters({ page } as Partial<TFilters>);
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
		} as Partial<TFilters>);
	}, [filters.sort_by, filters.sort_order, updateFilters]);

	// Handle search
	const onSearch = useCallback((searchValue: string) => {
		setSearchQuery(searchValue);
		updateFilters({
			search: searchValue,
			page: 1 // Reset to first page when searching
		} as Partial<TFilters>);
	}, [updateFilters]);

	// Handle per page change
	const onPerPageChange = useCallback((perPage: number) => {
		updateFilters({
			per_page: perPage,
			page: 1 // Reset to first page when changing page size
		} as Partial<TFilters>);
	}, [updateFilters]);

	// Handle custom filter changes
	const onFilterChange = useCallback((key: string, value: any) => {
		updateFilters({
			[key]: value,
			page: 1 // Reset to first page when filtering
		} as Partial<TFilters>);
	}, [updateFilters]);

	// Reset all filters
	const resetFilters = useCallback(() => {
		const resetFilters: TFilters = {
			page: 1,
			per_page: defaultPerPage,
			search: '',
			sort_by: defaultSortBy,
			sort_order: defaultSortOrder,
			...initialFilters
		} as TFilters;
		
		setFilters(resetFilters);
		setSearchQuery('');
		updateURL(resetFilters);
	}, [defaultPerPage, defaultSortBy, defaultSortOrder, initialFilters, updateURL]);

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

// Generic hook that combines filters with API query
export const useGenericTable = <TData, TFilters extends ServerTableFilters>(
	useApiQuery: (filters: TFilters, options?: any) => {
		data?: GenericApiResponse<TData>;
		isLoading: boolean;
		isFetching: boolean;
		isError: boolean;
		error: any;
		refetch: () => void;
	},
	dataKey: string, // e.g., 'categories', 'products', 'brands'
	props: UseGenericTableProps<TFilters>
): UseGenericTableReturn<TData, TFilters> => {
	const tableState = useGenericTableFilters(props);
	
	// Use the API query with current filters
	const apiResult = useApiQuery(tableState.filters, {
		refetchOnMountOrArgChange: true
	});

	// Extract data and meta from response
	const data = apiResult.data?.data?.[dataKey] || [];
	const meta = apiResult.data?.meta || null;

	return {
		...tableState,
		data,
		meta,
		isLoading: apiResult.isLoading,
		isFetching: apiResult.isFetching,
		isError: apiResult.isError,
		error: apiResult.error,
		refetch: apiResult.refetch
	};
};