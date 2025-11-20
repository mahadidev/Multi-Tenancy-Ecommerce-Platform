import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useGetProductCategoriesTableQuery } from '../store/categoryApi';
import type { Category, CategoryFilters } from '../types';
import type { UseGenericTableReturn, GenericApiResponse } from '@seller/_hooks/types/table';

// Adapter function to match the expected interface
const useProductCategoriesTableQueryAdapter = (filters: CategoryFilters, options?: any) => {
  const result = useGetProductCategoriesTableQuery(filters, options);
  
  return {
    data: result.data as GenericApiResponse<Category> | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error || null,
    refetch: result.refetch
  };
};

// Generic table hook for categories
export const useCategoryTableGeneric = (): UseGenericTableReturn<Category, CategoryFilters> => {
  return useGenericTable(
    useProductCategoriesTableQueryAdapter,
    'categories', // Data key in API response
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['name', 'slug', 'parent'],
      initialFilters: {
        type: 'product' // Default filter for product categories
      }
    }
  );
};

export default useCategoryTableGeneric;