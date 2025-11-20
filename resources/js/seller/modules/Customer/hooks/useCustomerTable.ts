import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchCustomersTableQuery } from '../store/customerApi';
import type { Customer, CustomerFilters } from '../types';
import type { UseGenericTableReturn, GenericApiResponse } from '@seller/_hooks/types/table';

// Adapter function to match the expected interface
const useCustomersTableQueryAdapter = (filters: CustomerFilters, options?: any) => {
  const result = useFetchCustomersTableQuery(filters, options);
  
  return {
    data: result.data as GenericApiResponse<Customer> | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error || null,
    refetch: result.refetch
  };
};

// Generic table hook for customers
export const useCustomerTable = (): UseGenericTableReturn<Customer, CustomerFilters> => {
  return useGenericTable(
    useCustomersTableQueryAdapter,
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