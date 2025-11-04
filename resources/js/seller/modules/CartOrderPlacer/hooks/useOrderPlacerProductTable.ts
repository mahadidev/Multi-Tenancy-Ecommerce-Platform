import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchOrderPlacerProductsTableQuery } from '../store/cartOrderPlacerApi';
import type { ProductType } from '@type/productType';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

export interface OrderPlacerProductFilters {
  search?: string;
  category_id?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Generic table hook for order placer products
export const useOrderPlacerProductTable = (): UseGenericTableReturn<ProductType, OrderPlacerProductFilters> => {
  return useGenericTable(
    useFetchOrderPlacerProductsTableQuery,
    'products', // Data key in API response
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['name', 'sku'],
    }
  );
};

export default useOrderPlacerProductTable;