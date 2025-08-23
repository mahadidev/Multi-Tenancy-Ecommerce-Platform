import { useAppSelector } from "@seller/store/store";
import { useMemo } from "react";

/**
 * Permission management hook for the seller dashboard
 * Provides utilities to check user permissions and control access to features
 */
const usePermissions = () => {
    // Get current user data from auth store
    const { userProfileData } = useAppSelector((state) => state.auth);
    
    // Extract permissions array from user data
    const userPermissions = useMemo(() => {
        return userProfileData?.permissions || [];
    }, [userProfileData?.permissions]);

    // Check if current user is the store owner
    const isStoreOwner = useMemo(() => {
        return userProfileData?.is_store_owner || userProfileData?.store_session?.is_owner || false;
    }, [userProfileData?.is_store_owner, userProfileData?.store_session?.is_owner]);

    /**
     * Check if user has a specific permission
     * @param permission - The permission slug to check
     * @returns boolean indicating if user has the permission
     */
    const hasPermission = (permission: string): boolean => {
        // Store owners have all permissions
        if (isStoreOwner) {
            return true;
        }
        return userPermissions.includes(permission);
    };

    /**
     * Check if user has any of the specified permissions (OR logic)
     * @param permissions - Array of permission slugs to check
     * @returns boolean indicating if user has at least one permission
     */
    const hasAnyPermission = (permissions: string[]): boolean => {
        // Store owners have all permissions
        if (isStoreOwner) {
            return true;
        }
        return permissions.some(permission => userPermissions.includes(permission));
    };

    /**
     * Check if user has all of the specified permissions (AND logic)
     * @param permissions - Array of permission slugs to check
     * @returns boolean indicating if user has all permissions
     */
    const hasAllPermissions = (permissions: string[]): boolean => {
        // Store owners have all permissions
        if (isStoreOwner) {
            return true;
        }
        return permissions.every(permission => userPermissions.includes(permission));
    };

    /**
     * Permission constants for easy reference
     * These match the permission slugs from the backend seeder
     */
    const PERMISSIONS = {
        // Product Management
        PRODUCTS_VIEW: 'products.view',
        PRODUCTS_CREATE: 'products.create',
        PRODUCTS_EDIT: 'products.edit',
        PRODUCTS_DELETE: 'products.delete',
        PRODUCTS_MANAGE_STOCK: 'products.manage_stock',

        // Category Management  
        CATEGORIES_VIEW: 'categories.view',
        CATEGORIES_CREATE: 'categories.create',
        CATEGORIES_EDIT: 'categories.edit',
        CATEGORIES_DELETE: 'categories.delete',

        // Order Management
        ORDERS_VIEW: 'orders.view',
        ORDERS_CREATE: 'orders.create',
        ORDERS_EDIT: 'orders.edit',
        ORDERS_DELETE: 'orders.delete',
        ORDERS_REFUND: 'orders.refund',

        // Financial Management
        EXPENSES_VIEW: 'expenses.view',
        EXPENSES_CREATE: 'expenses.create',
        EXPENSES_EDIT: 'expenses.edit',
        EXPENSES_DELETE: 'expenses.delete',
        REPORTS_FINANCIAL: 'reports.financial',

        // Vendor Management
        VENDORS_VIEW: 'vendors.view',
        VENDORS_CREATE: 'vendors.create',
        VENDORS_EDIT: 'vendors.edit',
        VENDORS_DELETE: 'vendors.delete',

        // User Management
        STORE_VIEW_USERS: 'store.view_users',
        STORE_CREATE_USERS: 'store.create_users',
        STORE_EDIT_USERS: 'store.edit_users',
        STORE_DELETE_USERS: 'store.delete_users',

        // Customer Management
        CUSTOMERS_VIEW: 'customers.view',
        CUSTOMERS_CREATE: 'customers.create',
        CUSTOMERS_EDIT: 'customers.edit',
        CUSTOMERS_DELETE: 'customers.delete',

        // Role Management
        ROLES_VIEW: 'roles.view',
        ROLES_CREATE: 'roles.create',
        ROLES_EDIT: 'roles.edit',
        ROLES_DELETE: 'roles.delete',
        ROLES_ASSIGN: 'roles.assign',

        // Permission Management
        PERMISSIONS_VIEW: 'permissions.view',
        PERMISSIONS_EDIT: 'permissions.edit',

        // Settings
        SETTINGS_VIEW: 'settings.view',
        SETTINGS_EDIT: 'settings.edit',

        // Analytics & Reports
        ANALYTICS_VIEW: 'analytics.view',
        REPORTS_SALES: 'reports.sales',

        // Blog Management
        BLOGS_VIEW: 'blogs.view',
        BLOGS_CREATE: 'blogs.create',
        BLOGS_EDIT: 'blogs.edit',
        BLOGS_DELETE: 'blogs.delete',

        // Menu Management
        MENUS_VIEW: 'menus.view',
        MENUS_CREATE: 'menus.create',
        MENUS_EDIT: 'menus.edit',
        MENUS_DELETE: 'menus.delete',

        // Page Management
        PAGES_VIEW: 'pages.view',
        PAGES_CREATE: 'pages.create',
        PAGES_EDIT: 'pages.edit',
        PAGES_DELETE: 'pages.delete',
    } as const;

    /**
     * Permission groups for common access patterns
     */
    const PERMISSION_GROUPS = {
        // Can view products (any product-related permission)
        PRODUCT_ACCESS: [
            PERMISSIONS.PRODUCTS_VIEW,
            PERMISSIONS.PRODUCTS_CREATE,
            PERMISSIONS.PRODUCTS_EDIT,
            PERMISSIONS.PRODUCTS_DELETE,
            PERMISSIONS.PRODUCTS_MANAGE_STOCK,
        ],
        
        // Can view categories/brands (any category permission)
        CATEGORY_ACCESS: [
            PERMISSIONS.CATEGORIES_VIEW,
            PERMISSIONS.CATEGORIES_CREATE,
            PERMISSIONS.CATEGORIES_EDIT,
            PERMISSIONS.CATEGORIES_DELETE,
        ],

        // Can view orders (any order permission)
        ORDER_ACCESS: [
            PERMISSIONS.ORDERS_VIEW,
            PERMISSIONS.ORDERS_CREATE,
            PERMISSIONS.ORDERS_EDIT,
            PERMISSIONS.ORDERS_DELETE,
            PERMISSIONS.ORDERS_REFUND,
        ],

        // Can view expenses (any expense permission)
        EXPENSE_ACCESS: [
            PERMISSIONS.EXPENSES_VIEW,
            PERMISSIONS.EXPENSES_CREATE,
            PERMISSIONS.EXPENSES_EDIT,
            PERMISSIONS.EXPENSES_DELETE,
        ],

        // Can view vendors (any vendor permission)
        VENDOR_ACCESS: [
            PERMISSIONS.VENDORS_VIEW,
            PERMISSIONS.VENDORS_CREATE,
            PERMISSIONS.VENDORS_EDIT,
            PERMISSIONS.VENDORS_DELETE,
        ],

        // Store admin access (user management)
        ADMIN_ACCESS: [
            PERMISSIONS.STORE_VIEW_USERS,
            PERMISSIONS.STORE_CREATE_USERS,
            PERMISSIONS.STORE_EDIT_USERS,
            PERMISSIONS.STORE_DELETE_USERS,
        ],

        // Customer access (any customer permission)
        CUSTOMER_ACCESS: [
            PERMISSIONS.CUSTOMERS_VIEW,
            PERMISSIONS.CUSTOMERS_CREATE,
            PERMISSIONS.CUSTOMERS_EDIT,
            PERMISSIONS.CUSTOMERS_DELETE,
        ],

        // Role access (any role permission)
        ROLE_ACCESS: [
            PERMISSIONS.ROLES_VIEW,
            PERMISSIONS.ROLES_CREATE,
            PERMISSIONS.ROLES_EDIT,
            PERMISSIONS.ROLES_DELETE,
            PERMISSIONS.ROLES_ASSIGN,
        ],

        // Settings access (any settings permission)
        SETTINGS_ACCESS: [
            PERMISSIONS.SETTINGS_VIEW,
            PERMISSIONS.SETTINGS_EDIT,
        ],

        // Blog access (any blog permission)
        BLOG_ACCESS: [
            PERMISSIONS.BLOGS_VIEW,
            PERMISSIONS.BLOGS_CREATE,
            PERMISSIONS.BLOGS_EDIT,
            PERMISSIONS.BLOGS_DELETE,
        ],

        // Menu access (any menu permission)
        MENU_ACCESS: [
            PERMISSIONS.MENUS_VIEW,
            PERMISSIONS.MENUS_CREATE,
            PERMISSIONS.MENUS_EDIT,
            PERMISSIONS.MENUS_DELETE,
        ],

        // Page access (any page permission)
        PAGE_ACCESS: [
            PERMISSIONS.PAGES_VIEW,
            PERMISSIONS.PAGES_CREATE,
            PERMISSIONS.PAGES_EDIT,
            PERMISSIONS.PAGES_DELETE,
        ],
    } as const;

    /**
     * Check if user can access specific modules
     */
    const canAccess = {
        dashboard: () => isStoreOwner || hasAnyPermission(['analytics.view', 'reports.export']),
        products: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.PRODUCT_ACCESS]),
        categories: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.CATEGORY_ACCESS]),
        orders: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.ORDER_ACCESS]),
        customers: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.CUSTOMER_ACCESS]),
        expenses: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.EXPENSE_ACCESS]),
        vendors: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.VENDOR_ACCESS]),
        settings: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.SETTINGS_ACCESS]),
        accessManagement: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.ADMIN_ACCESS]),
        storeAdmin: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.ADMIN_ACCESS]),
        orderPlacer: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.ORDER_ACCESS]),
        blogs: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.BLOG_ACCESS]),
        menus: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.MENU_ACCESS]),
        pages: () => isStoreOwner || hasAnyPermission([...PERMISSION_GROUPS.PAGE_ACCESS]),
    };

    return {
        // Core permission checking functions
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        
        // Permission constants
        PERMISSIONS,
        PERMISSION_GROUPS,
        
        // Module access checkers
        canAccess,
        
        // User's current permissions
        userPermissions,
        
        // Store owner status
        isStoreOwner,
        
        // Check if user has any permissions (is not a basic user) or is store owner
        hasAnyPermissions: isStoreOwner || userPermissions.length > 0,
    };
};

export default usePermissions;