import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchBrandsTableQuery } from '../store/brandApi';
import type { Brand, BrandFilters } from '../types';
import type { UseGenericTableReturn, GenericApiResponse } from '@seller/_hooks/types/table';

// Adapter function to match the expected interface
const useBrandsTableQueryAdapter = (filters: BrandFilters, options?: any) => {
  const result = useFetchBrandsTableQuery(filters, options);
  
  return {
    data: result.data as GenericApiResponse<Brand> | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error || null,
    refetch: result.refetch
  };
};

// Generic table hook for brands
export const useBrandTable = (): UseGenericTableReturn<Brand, BrandFilters> => {
  return useGenericTable(
    useBrandsTableQueryAdapter,
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