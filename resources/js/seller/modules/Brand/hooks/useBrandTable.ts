import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchBrandsTableQuery } from '../store/brandApi';
import type { Brand, BrandFilters } from '../types';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

// Generic table hook for brands
export const useBrandTable = (): UseGenericTableReturn<Brand, BrandFilters> => {
  return useGenericTable(
    useFetchBrandsTableQuery,
    'brands', // Data key in API response
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['name', 'slug'],
    }
  );
};

export default useBrandTable;