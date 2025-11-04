import type { UseGenericTableReturn } from '@seller/_hooks/types/table';
import { useGenericTable } from '@seller/_hooks/useGenericTable';
import type { Vendor } from '../types';
import { useFetchVendorsTableQuery } from '../store/expenseApi';
import type { VendorFilters } from '../types';

// Generic table hook for vendors
export const useVendorTable = (): UseGenericTableReturn<Vendor, VendorFilters> => {
  return useGenericTable(
    useFetchVendorsTableQuery,
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
