import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchVendorsTableQuery } from '../store/expenseApi';
import type { VendorType } from '@type/vendorType';
import type { VendorFilters } from '../types';
import type { UseGenericTableReturn } from '@seller/_hooks/types/table';

// Generic table hook for vendors
export const useVendorTable = (): UseGenericTableReturn<VendorType, VendorFilters> => {
  return useGenericTable(
    useFetchVendorsTableQuery,
    'data.vendors', // Data key in API response - nested under data
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['name', 'email', 'phone', 'address', 'contact_person'],
    }
  );
};

export default useVendorTable;