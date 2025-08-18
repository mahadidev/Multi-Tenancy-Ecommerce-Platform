# Frontend Permission System

This document describes how to use the frontend permission system to control access to features and UI elements based on user permissions.

## Overview

The permission system consists of:
1. **usePermissions Hook** - Core permission checking logic
2. **PermissionGuard Component** - Conditional rendering based on permissions  
3. **Permission-Aware Navigation** - Automatic hiding of navigation items
4. **Backend Integration** - User permissions loaded from API

## Quick Start

### 1. Check User Permissions

```typescript
import usePermissions from '@seller/hooks/usePermissions';

const MyComponent = () => {
    const { hasPermission, canAccess, PERMISSIONS } = usePermissions();
    
    if (hasPermission(PERMISSIONS.PRODUCTS_CREATE)) {
        // User can create products
    }
    
    if (canAccess.products()) {
        // User can access product module
    }
};
```

### 2. Conditional Rendering with PermissionGuard

```typescript
import { PermissionGuard } from '@seller/components';

// Show button only if user can create products
<PermissionGuard permission="products.create">
    <CreateProductButton />
</PermissionGuard>

// Show component if user has ANY of these permissions
<PermissionGuard permissions={['products.view', 'products.create']}>
    <ProductList />
</PermissionGuard>

// Show component if user has ALL of these permissions
<PermissionGuard requireAll={['products.create', 'categories.manage']}>
    <AdvancedProductForm />
</PermissionGuard>

// Custom condition with fallback
<PermissionGuard 
    condition={() => user.role === 'admin'} 
    fallback={<div>Access Denied</div>}
>
    <AdminPanel />
</PermissionGuard>
```

## Available Permissions

### Product Management
- `products.view` - View product listings
- `products.create` - Create new products  
- `products.edit` - Edit existing products
- `products.delete` - Delete products
- `products.manage_stock` - Manage inventory

### Category Management
- `categories.view` - View categories
- `categories.manage` - Create, edit, delete categories

### Order Management
- `orders.view` - View orders
- `orders.manage` - Process and manage orders
- `orders.refund` - Process refunds

### Financial Management  
- `expenses.view` - View expenses
- `expenses.create` - Create expenses
- `expenses.edit` - Edit expenses
- `expenses.delete` - Delete expenses
- `vendors.manage` - Manage vendors
- `reports.financial` - View financial reports

### Store Management
- `store.view` - View store settings
- `store.edit` - Edit store settings  
- `store.manage_users` - Manage store users and roles

### Customer Management
- `customers.view` - View customers
- `customers.manage` - Manage customer data

## Permission Logic

### Logical Access Patterns

The system implements logical permission groups:

```typescript
// Users with ANY product permission can view products
const PRODUCT_ACCESS = [
    'products.view',
    'products.create', 
    'products.edit',
    'products.delete',
    'products.manage_stock'
];

// Users who can create/edit products can also view categories  
const CATEGORY_ACCESS = [
    'categories.view',
    'categories.manage',
    'products.view',
    'products.create',
    'products.edit'
];
```

### Navigation Filtering

Navigation items are automatically filtered based on permissions:

```typescript
// This navigation item requires ANY of these permissions
{
    href: '/products',
    label: 'Products', 
    permissions: [
        'products.view',
        'products.create',
        'products.edit',
        'products.delete'
    ]
}
```

## Advanced Usage

### Custom Permission Logic

```typescript
import usePermissions from '@seller/hooks/usePermissions';

const useCustomPermissions = () => {
    const { hasPermission, hasAnyPermission } = usePermissions();
    
    const canManageInventory = () => {
        return hasAnyPermission([
            'products.manage_stock',
            'products.edit',
            'store.manage_users' // Admins can do everything
        ]);
    };
    
    const canViewReports = () => {
        return hasAnyPermission([
            'reports.financial',
            'reports.sales',
            'analytics.view'
        ]);
    };
    
    return { canManageInventory, canViewReports };
};
```

### Permission-Based Routing

```typescript
import { PermissionGuard } from '@seller/components';
import { Route } from 'react-router-dom';

// Protect entire routes
<Route path="/products" element={
    <PermissionGuard 
        permissions={['products.view', 'products.create', 'products.edit']}
        fallback={<AccessDeniedPage />}
    >
        <ProductsPage />
    </PermissionGuard>
} />
```

### Complex Conditions

```typescript
<PermissionGuard 
    condition={() => {
        const { hasPermission, userPermissions } = usePermissions();
        
        // Complex logic: Admin OR (can edit products AND manage categories)
        return hasPermission('store.manage_users') || 
               (hasPermission('products.edit') && hasPermission('categories.manage'));
    }}
>
    <SuperUserFeature />
</PermissionGuard>
```

## Best Practices

### 1. Use Permission Constants
```typescript
// Good
import usePermissions from '@seller/hooks/usePermissions';
const { PERMISSIONS } = usePermissions();
hasPermission(PERMISSIONS.PRODUCTS_CREATE);

// Avoid
hasPermission('products.create'); // Hard-coded string
```

### 2. Group Related Permissions
```typescript
// Good - Use permission groups for common patterns
<PermissionGuard permissions={PERMISSION_GROUPS.PRODUCT_ACCESS}>

// Avoid - Repeating permission lists
<PermissionGuard permissions={['products.view', 'products.create', 'products.edit']}>
```

### 3. Provide Meaningful Fallbacks
```typescript
// Good
<PermissionGuard 
    permission="products.create"
    fallback={<div>You need 'Create Products' permission to access this feature.</div>}
>

// Avoid
<PermissionGuard permission="products.create">
// No fallback - component just disappears
```

### 4. Handle Loading States
```typescript
const { userPermissions, hasAnyPermissions } = usePermissions();

if (!hasAnyPermissions) {
    return <LoadingSpinner />; // Still loading permissions
}
```

## Integration Examples

### Table Actions
```typescript
{
    render: (row: ProductType) => (
        <Table.Cell>
            <div className="flex gap-2">
                <PermissionGuard permission="products.edit">
                    <EditButton product={row} />
                </PermissionGuard>
                <PermissionGuard permission="products.delete">
                    <DeleteButton product={row} />
                </PermissionGuard>
            </div>
        </Table.Cell>
    )
}
```

### Form Fields
```typescript
<form>
    <ProductNameField />
    <ProductDescriptionField />
    
    <PermissionGuard permission="products.manage_stock">
        <StockManagementSection />
    </PermissionGuard>
    
    <PermissionGuard permission="categories.manage">
        <CategoryCreationField />
    </PermissionGuard>
</form>
```

### Dashboard Widgets
```typescript
<Dashboard>
    <PermissionGuard permissions={PERMISSION_GROUPS.ORDER_ACCESS}>
        <OrdersWidget />
    </PermissionGuard>
    
    <PermissionGuard permission="reports.financial">
        <FinancialReportsWidget />
    </PermissionGuard>
    
    <PermissionGuard permissions={PERMISSION_GROUPS.PRODUCT_ACCESS}>
        <ProductStatsWidget />
    </PermissionGuard>
</Dashboard>
```

## Troubleshooting

### Common Issues

1. **Navigation not updating**: Clear browser cache and reload
2. **Permissions not loading**: Check if user is authenticated and has assigned roles
3. **Components still visible**: Ensure you're using the correct permission slug
4. **Performance issues**: Use permission groups instead of multiple individual checks

### Debug Permissions

```typescript
const { userPermissions } = usePermissions();
console.log('User permissions:', userPermissions);
```

This permission system provides a scalable, maintainable way to control access to features while following the principle of least privilege.