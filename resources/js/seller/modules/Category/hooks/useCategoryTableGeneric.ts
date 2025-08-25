import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useGetProductCategoriesTableQuery } from '../store/categoryApi';
import type { Category, CategoryFilters } from '../types';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

// Generic table hook for categories
export const useCategoryTableGeneric = (): UseGenericTableReturn<Category, CategoryFilters> => {
  return useGenericTable(
    useGetProductCategoriesTableQuery,
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