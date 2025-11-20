import type { UseGenericTableReturn, GenericApiResponse } from '@seller/_hooks/types/table';
import { useGenericTable } from '@seller/_hooks/useGenericTable';
import type { Vendor } from '../types';
import { useFetchVendorsTableQuery } from '../store/expenseApi';
import type { VendorFilters } from '../types';

// Adapter function to match the expected interface
const useVendorsTableQueryAdapter = (filters: VendorFilters, options?: any) => {
  const result = useFetchVendorsTableQuery(filters, options);
  
  return {
    data: result.data as GenericApiResponse<Vendor> | undefined,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error || null,
    refetch: result.refetch
  };
};

// Generic table hook for vendors
export const useVendorTable = (): UseGenericTableReturn<Vendor, VendorFilters> => {
  return useGenericTable(
    useVendorsTableQueryAdapter,
    'vendors', // Data key in API response - nested under data
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['name', 'email', 'phone', 'address', 'contact_person'],
    }
  );
};

export default useVendorTable;
