import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchProductsTableQuery } from '../store/productApi';
import type { ProductType } from '@type/productType';
import type { ProductFilters } from '../types';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

// Generic table hook for products
export const useProductTable = (): UseGenericTableReturn<ProductType, ProductFilters> => {
  return useGenericTable(
    useFetchProductsTableQuery,
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