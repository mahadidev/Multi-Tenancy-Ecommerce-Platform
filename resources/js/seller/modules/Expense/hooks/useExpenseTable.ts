import type { UseGenericTableReturn } from '@seller/_hooks/types/table';
import { useGenericTable } from '@seller/_hooks/useGenericTable';
import type { Expense } from '../types';
import { useFetchExpensesTableQuery } from '../store/expenseApi';
import type { ExpenseFilters } from '../types';

// Generic table hook for expenses
export const useExpenseTable = (): UseGenericTableReturn<Expense, ExpenseFilters> => {
  return useGenericTable(
    useFetchExpensesTableQuery,
    'expenses', // Data key in API response - nested under data
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['title', 'description', 'category', 'payment_method', 'vendor'],
    }
  );
};

export default useExpenseTable;
