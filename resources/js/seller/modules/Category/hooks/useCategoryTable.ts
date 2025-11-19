import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductCategoriesTableQuery } from '../store/categoryApi';
import { CategoryFilters } from '../types';

const useCategoryTable = () => {
  const [searchParams] = useSearchParams();

  // Convert URL params to category API filters
  const categoryFilters: CategoryFilters = useMemo(() => {
    const searchValue = searchParams.get('search');
    const converted = {
      page: parseInt(searchParams.get('page') || '1', 10),
      per_page: parseInt(searchParams.get('per_page') || '10', 10),
      ...(searchValue && { search: searchValue }), // Only include search if it has a value
      sort_by: (searchParams.get('sort_by') as CategoryFilters['sort_by']) || 'created_at',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
      type: 'product' as const // For product categories
    };
    console.log('🎯 useCategoryTable filters changed:', converted);
    return converted;
  }, [searchParams]);

  // Fetch categories with current filters
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useGetProductCategoriesTableQuery(categoryFilters, {
    refetchOnMountOrArgChange: true
  });


  // Extract data and meta from response
  const categories = response?.data?.categories || [];
  const meta = response?.meta || null;

  return {
    categories,
    meta,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    // Expose the filters for debugging
    currentFilters: categoryFilters
  };
};

export default useCategoryTable;
