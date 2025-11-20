import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchProductsTableQuery } from '../store/productApi';
import type { ProductType } from '@type/productType';
import type { ProductFilters } from '../types';
import type { UseGenericTableReturn, GenericApiResponse } from '@seller/_hooks/types/table';

// Adapter function to match the expected interface
const useProductsTableQueryAdapter = (filters: ProductFilters, options?: any) => {
  const result = useFetchProductsTableQuery(filters, options);
  
  return {
    data: result.data as GenericApiResponse<ProductType> | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error || null,
    refetch: result.refetch
  };
};

// Generic table hook for products
export const useProductTable = (): UseGenericTableReturn<ProductType, ProductFilters> => {
  return useGenericTable(
    useProductsTableQueryAdapter,
    'products', // Data key in API response
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['name', 'sku', 'slug'],
    }
  );
};

export default useProductTable;