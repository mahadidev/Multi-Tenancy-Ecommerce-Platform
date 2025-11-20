import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { 
	ServerTableFilters, 
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
}: UseGenericTableProps<TFilters>) => {
	const [searchParams, setSearchParams] = useSearchParams();

	// Get filters from URL or use defaults
	const getFiltersFromURL = useCallback((): TFilters => {
		const filters: any = {
			page: parseInt(searchParams.get('page') || '1', 10),
			per_page: parseInt(searchParams.get('per_page') || defaultPerPage.toString(), 10),
			search: searchParams.get('search') || '',
			sort_by: searchParams.get('sort_by') || defaultSortBy,
			sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || defaultSortOrder,
			...initialFilters
		};
		
		// Extract ALL URL parameters, not just basic ones
		for (const [key, value] of searchParams.entries()) {
			if (!['page', 'per_page', 'search', 'sort_by', 'sort_order'].includes(key) && value) {
				// Handle numeric values
				if (key === 'page' || key === 'per_page') {
					filters[key] = parseInt(value, 10);
				} else {
					filters[key] = value;
				}
			}
		}
		
		return filters as TFilters;
	}, [searchParams, defaultSortBy, defaultSortOrder, defaultPerPage, initialFilters]);

	// State for current filters
	const [filters, setFilters] = useState<TFilters>(getFiltersFromURL);
	const [searchQuery, setSearchQuery] = useState(filters.search || '');
	const previousFiltersRef = useRef<TFilters>(filters);
	const urlParamsRef = useRef<string>(searchParams.toString());
	const isInternalUpdate = useRef(false);

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

		// Mark this as an internal update to prevent feedback loop
		isInternalUpdate.current = true;
		urlParamsRef.current = params.toString();
		setSearchParams(params);
	}, [setSearchParams, defaultPerPage]);

	// Update filters
	const updateFilters = useCallback((newFilters: Partial<TFilters>) => {
		setFilters((prevFilters) => {
			const updatedFilters = {
				...prevFilters,
				...newFilters
			} as TFilters;
			
			previousFiltersRef.current = updatedFilters;
			updateURL(updatedFilters);
			return updatedFilters;
		});
	}, [updateURL]);

	// Handle page change
	const onPageChange = useCallback((page: number) => {
		updateFilters({ page } as Partial<TFilters>);
	}, [updateFilters]);

	// Handle sort change
	const onSort = useCallback((sortBy: string) => {
		setFilters((prevFilters) => {
			const currentSortBy = prevFilters.sort_by;
			const currentSortOrder = prevFilters.sort_order;
			
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

			const updatedFilters = {
				...prevFilters,
				sort_by: sortBy,
				sort_order: newSortOrder,
				page: 1 // Reset to first page when sorting
			} as TFilters;
			
			previousFiltersRef.current = updatedFilters;
			updateURL(updatedFilters);
			return updatedFilters;
		});
	}, [updateURL]);

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

	// Sync URL changes back to state (only if different to prevent feedback loop)
	useEffect(() => {
		const currentUrlParams = searchParams.toString();
		
		// Skip this update if it's from our own internal updateURL call
		if (isInternalUpdate.current) {
			isInternalUpdate.current = false;
			urlParamsRef.current = currentUrlParams;
			return;
		}
		
		// Only update if URL actually changed externally (not from our own updateURL call)
		if (urlParamsRef.current !== currentUrlParams) {
			const urlFilters = getFiltersFromURL();
			
			// More robust comparison - normalize filters before comparing
			const normalizeFilters = (f: TFilters) => {
				const normalized = { ...f };
				// Remove undefined/null/empty values for comparison
				Object.keys(normalized).forEach(key => {
					if (normalized[key as keyof TFilters] === undefined || 
						normalized[key as keyof TFilters] === null || 
						normalized[key as keyof TFilters] === '') {
						delete normalized[key as keyof TFilters];
					}
				});
				return normalized;
			};
			
			const currentNormalized = normalizeFilters(filters);
			const urlNormalized = normalizeFilters(urlFilters);
			
			// Only update if meaningful filter values are different
			const currentFiltersString = JSON.stringify(currentNormalized);
			const urlFiltersString = JSON.stringify(urlNormalized);
			
			if (currentFiltersString !== urlFiltersString) {
				urlParamsRef.current = currentUrlParams;
				previousFiltersRef.current = urlFilters;
				setFilters(urlFilters);
				setSearchQuery(urlFilters.search || '');
			}
		}
	}, [searchParams, getFiltersFromURL, filters]);

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
		// Removed refetchOnMountOrArgChange to prevent double fetches
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