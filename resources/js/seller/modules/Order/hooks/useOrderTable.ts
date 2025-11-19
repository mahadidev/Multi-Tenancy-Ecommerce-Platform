import { useGenericTableFilters } from '@seller/_hooks/useGenericTable';
import { useFetchOrdersTableQuery } from '../store/orderApi';
import type { OrderType } from '@type/orderType';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

export interface OrderFilters {
  search?: string;
  status?: string;
  payment_method?: string;
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Generic table hook for orders
export const useOrderTable = (): UseGenericTableReturn<OrderType, OrderFilters> => {
  const tableState = useGenericTableFilters<OrderFilters>({
    defaultSortBy: 'created_at',
    defaultSortOrder: 'desc',
    defaultPerPage: 10,
    searchableColumns: ['order_uuid', 'user_name', 'user_email', 'total', 'created_at'],
  });

  // Use RTK Query hook with current filters
  const apiResult = useFetchOrdersTableQuery(tableState.filters, {
    refetchOnMountOrArgChange: true
  });

  // Extract data and meta from response
  const data = apiResult.data?.data?.orders || [];
  const meta = (apiResult.data as any)?.meta || null;

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

export default useOrderTable;