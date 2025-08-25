import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchExpensesTableQuery } from '../store/expenseApi';
import type { ExpenseType } from '@type/expenseType';
import type { ExpenseFilters } from '../types';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

// Generic table hook for expenses
export const useExpenseTable = (): UseGenericTableReturn<ExpenseType, ExpenseFilters> => {
  return useGenericTable(
    useFetchExpensesTableQuery,
    'data.expenses', // Data key in API response - nested under data
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['title', 'description', 'category', 'payment_method', 'vendor'],
    }
  );
};

export default useExpenseTable;