import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchOrderPlacerProductsTableQuery } from '../store/cartOrderPlacerApi';
import type { ProductType } from '@type/productType';
import type { UseGenericTableReturn, GenericApiResponse } from '@seller/_hooks/types/table';

export interface OrderPlacerProductFilters {
  search?: string;
  category_id?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Adapter function to match the expected interface
const useOrderPlacerProductsTableQueryAdapter = (filters: OrderPlacerProductFilters, options?: any) => {
  const result = useFetchOrderPlacerProductsTableQuery(filters, options);
  
  return {
    data: result.data as GenericApiResponse<ProductType> | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error || null,
    refetch: result.refetch
  };
};

// Generic table hook for order placer products
export const useOrderPlacerProductTable = (): UseGenericTableReturn<ProductType, OrderPlacerProductFilters> => {
  return useGenericTable(
    useOrderPlacerProductsTableQueryAdapter,
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