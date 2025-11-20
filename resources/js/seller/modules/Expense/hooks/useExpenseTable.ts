import { useGenericTableFilters } from '@seller/_hooks/useGenericTable';
import { useFetchExpensesTableQuery } from '../store/expenseApi';
import type { Expense } from '../types';
import type { ExpenseFilters } from '../types';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

// Generic table hook for expenses
export const useExpenseTable = (): UseGenericTableReturn<Expense, ExpenseFilters> => {
  const tableState = useGenericTableFilters<ExpenseFilters>({
    defaultSortBy: 'created_at',
    defaultSortOrder: 'desc',
    defaultPerPage: 10,
    searchableColumns: ['title', 'description', 'category', 'payment_method', 'vendor'],
  });

  // Use RTK Query hook with current filters - keep refetchOnMountOrArgChange but ensure filter consistency
  const apiResult = useFetchExpensesTableQuery(tableState.filters, {
    refetchOnMountOrArgChange: true
  });

  // Extract data and meta from response
  const data = apiResult.data?.data?.expenses || [];
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

export default useExpenseTable;
