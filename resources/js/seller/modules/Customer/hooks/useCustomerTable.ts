import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchCustomersTableQuery } from '../store/customerApi';
import type { Customer, CustomerFilters } from '../types';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

// Generic table hook for customers
export const useCustomerTable = (): UseGenericTableReturn<Customer, CustomerFilters> => {
  return useGenericTable(
    useFetchCustomersTableQuery,
    'customers', // Data key in API response
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['name', 'email', 'phone', 'address'],
    }
  );
};

export default useCustomerTable;