# Generic Table System

A reusable table system for creating consistent, feature-rich data tables across the application.

## Features

- **Server-side pagination, sorting, and filtering**
- **URL synchronization** - table state persists in URL
- **Search functionality** with customizable columns
- **Skeleton loading** with realistic placeholders
- **Export to CSV** capability
- **Responsive design** with dark mode support
- **Type-safe** with full TypeScript support

## Quick Start

### 1. Define Your Types

```typescript
// modules/YourModule/types/index.ts
import type { ServerTableFilters } from '@seller/_hooks/types/table';

export interface YourItem {
  id: number;
  name: string;
  created_at: string;
  // ... other properties
}

export interface YourFilters extends ServerTableFilters {
  // Add module-specific filters
  status?: 'active' | 'inactive';
  category_id?: number;
  sort_by?: 'name' | 'created_at'; // Specify allowed sort columns
}
```

### 2. Add Table Query to Your API

```typescript
// modules/YourModule/store/yourApi.ts
export const yourApi = createApi({
  // ... existing config
  endpoints: (builder) => ({
    // ... existing endpoints
    
    // Add this table query
    fetchYourItemsTable: builder.query<YourResponse, YourFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
        
        return createRequest({
          url: \`\${PREFIX}/your-endpoint?\${params.toString()}\`,
          method: "get",
        });
      },
      providesTags: ["YourItems"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  // ... existing hooks
  useFetchYourItemsTableQuery, // Export the new hook
} = yourApi;
```

### 3. Create Table Hook

```typescript
// modules/YourModule/hooks/useYourTable.ts
import { useGenericTable } from '@seller/_hooks/useGenericTable';
import { useFetchYourItemsTableQuery } from '../store/yourApi';
import type { YourItem, YourFilters } from '../types';

export const useYourTable = () => {
  return useGenericTable(
    useFetchYourItemsTableQuery,
    'yourItems', // Data key in API response (e.g., { data: { yourItems: [...] } })
    {
      defaultSortBy: 'created_at',
      defaultSortOrder: 'desc',
      defaultPerPage: 10,
      searchableColumns: ['name', 'description'],
      initialFilters: {
        status: 'active' // Default filters if needed
      }
    }
  );
};
```

### 4. Create Table Component

```typescript
// modules/YourModule/pages/YourTable.tsx
import GenericTable from "@seller/components/DataTable/GenericTable";
import { Table } from "flowbite-react";
import useYourTable from "../hooks/useYourTable";
import type { YourItem } from "../types";

const YourTable = () => {
  const table = useYourTable();

  return (
    <GenericTable
      table={table}
      columns={[
        {
          label: "Name",
          key: "name",
          render: (row: YourItem) => (
            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
              {row.name}
            </Table.Cell>
          ),
          sortable: true,
        },
        {
          label: "Created At",
          key: "created_at",
          render: (row: YourItem) => (
            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
              {new Date(row.created_at).toLocaleDateString()}
            </Table.Cell>
          ),
          sortable: true,
        },
        {
          label: "Actions",
          render: (row: YourItem) => (
            <Table.Cell>
              <div className="flex items-center gap-x-3">
                <EditModal item={row} />
                <DeleteModal item={row} />
              </div>
            </Table.Cell>
          ),
        },
      ]}
      search={{
        placeholder: "Search items...",
        columns: ["name", "description"],
      }}
      head={{
        render: (_data: YourItem[]) => <CreateModal />,
      }}
      exportable={true}
      filename="your-items"
      defaultSortBy="created_at"
      defaultSortOrder="desc"
      defaultPerPage={10}
    />
  );
};
```

## Available Props

### GenericTable Props

| Prop | Type | Description |
|------|------|-------------|
| `table` | `UseGenericTableReturn` | Table state from `useGenericTable` hook |
| `columns` | `Column[]` | Column definitions |
| `search` | `SearchConfig` | Search configuration |
| `head` | `HeadConfig` | Header actions (e.g., Create button) |
| `exportable` | `boolean` | Enable CSV export |
| `filename` | `string` | CSV filename |
| `disablePagination` | `boolean` | Disable pagination |
| `disableSl` | `boolean` | Disable serial number column |
| `disableHead` | `boolean` | Disable table header |

### Column Definition

```typescript
interface Column {
  label: string;           // Column header text
  key?: string;           // Data key for sorting
  render: (row: T) => JSX.Element; // Cell renderer
  sortable?: boolean;     // Enable sorting
}
```

### Search Configuration

```typescript
interface SearchConfig {
  placeholder: string;    // Search input placeholder
  columns: string[];      // Searchable column keys
  autoFocus?: boolean;    // Auto-focus search input
}
```

## Examples

See the following example implementations:

- **Categories**: `modules/Category/pages/CategoriesTableGeneric.tsx`
- **Brands**: `modules/Brand/pages/BrandsTableGeneric.tsx`
- **Products**: `modules/Product/pages/ProductsTableGeneric.tsx`

## Migration from Old Tables

1. Update your types to extend `ServerTableFilters`
2. Add table query to your API
3. Create table hook using `useGenericTable`
4. Replace `DataTable` with `GenericTable`
5. Update column definitions and props

## Benefits

- **Consistency**: All tables have the same behavior and styling
- **Maintainability**: Changes to table functionality happen in one place
- **Performance**: Built-in optimizations for large datasets
- **User Experience**: Consistent loading states, search, and pagination
- **Developer Experience**: Type-safe, well-documented API