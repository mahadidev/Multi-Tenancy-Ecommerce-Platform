import { useAppSelector } from "@seller/store/store";
import { useMemo } from "react";

const usePermissions = () => {
    const { userProfileData } = useAppSelector((state) => state.auth);
    
    const userPermissions = useMemo(() => {
        return userProfileData?.permissions || [];
    }, [userProfileData?.permissions]);

    const isStoreOwner = useMemo(() => {
        return userProfileData?.is_store_owner || userProfileData?.store_session?.is_owner || false;
    }, [userProfileData?.is_store_owner, userProfileData?.store_session?.is_owner]);

    const hasPermission = (permission: string): boolean => {
        if (isStoreOwner) {
            return true;
        }
        return userPermissions.includes(permission);
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        if (isStoreOwner) {
            return true;
        }
        return permissions.some(permission => userPermissions.includes(permission));
    };

    const hasAllPermissions = (permissions: string[]): boolean => {
        if (isStoreOwner) {
            return true;
        }
        return permissions.every(permission => userPermissions.includes(permission));
    };

    const PERMISSIONS = {
        PRODUCTS_VIEW: 'products.view',
        PRODUCTS_CREATE: 'products.create',
        PRODUCTS_EDIT: 'products.edit',
        PRODUCTS_DELETE: 'products.delete',
        PRODUCTS_MANAGE_STOCK: 'products.manage_stock',

        CATEGORIES_VIEW: 'categories.view',
        CATEGORIES_CREATE: 'categories.create',
        CATEGORIES_EDIT: 'categories.edit',
        CATEGORIES_DELETE: 'categories.delete',

        ORDERS_VIEW: 'orders.view',
        ORDERS_CREATE: 'orders.create',
        ORDERS_EDIT: 'orders.edit',
        ORDERS_DELETE: 'orders.delete',
        ORDERS_REFUND: 'orders.refund',

        EXPENSES_VIEW: 'expenses.view',
        EXPENSES_CREATE: 'expenses.create',
        EXPENSES_EDIT: 'expenses.edit',
        EXPENSES_DELETE: 'expenses.delete',
        REPORTS_FINANCIAL: 'reports.financial',

        VENDORS_VIEW: 'vendors.view',
        VENDORS_CREATE: 'vendors.create',
        VENDORS_EDIT: 'vendors.edit',
        VENDORS_DELETE: 'vendors.delete',

        STORE_VIEW_USERS: 'store.view_users',
        STORE_CREATE_USERS: 'store.create_users',
        STORE_EDIT_USERS: 'store.edit_users',
        STORE_DELETE_USERS: 'store.delete_users',

        CUSTOMERS_VIEW: 'customers.view',
        CUSTOMERS_CREATE: 'customers.create',
        CUSTOMERS_EDIT: 'customers.edit',
        CUSTOMERS_DELETE: 'customers.delete',

        ROLES_VIEW: 'roles.view',
        ROLES_CREATE: 'roles.create',
        ROLES_EDIT: 'roles.edit',
        ROLES_DELETE: 'roles.delete',
        ROLES_ASSIGN: 'roles.assign',

        PERMISSIONS_VIEW: 'permissions.view',
        PERMISSIONS_EDIT: 'permissions.edit',

        SETTINGS_VIEW: 'settings.view',
        SETTINGS_EDIT: 'settings.edit',

        ANALYTICS_VIEW: 'analytics.view',
        REPORTS_SALES: 'reports.sales',

        BLOGS_VIEW: 'blogs.view',
        BLOGS_CREATE: 'blogs.create',
        BLOGS_EDIT: 'blogs.edit',
        BLOGS_DELETE: 'blogs.delete',

        MENUS_VIEW: 'menus.view',
        MENUS_CREATE: 'menus.create',
        MENUS_EDIT: 'menus.edit',
        MENUS_DELETE: 'menus.delete',

        PAGES_VIEW: 'pages.view',
        PAGES_CREATE: 'pages.create',
        PAGES_EDIT: 'pages.edit',
        PAGES_DELETE: 'pages.delete',
    } as const;

    const PERMISSION_GROUPS = {
        PRODUCT_ACCESS: [
            PERMISSIONS.PRODUCTS_VIEW,
            PERMISSIONS.PRODUCTS_CREATE,
            PERMISSIONS.PRODUCTS_EDIT,
            PERMISSIONS.PRODUCTS_DELETE,
            PERMISSIONS.PRODUCTS_MANAGE_STOCK,
        ],
        
        CATEGORY_ACCESS: [
            PERMISSIONS.CATEGORIES_VIEW,
            PERMISSIONS.CATEGORIES_CREATE,
            PERMISSIONS.CATEGORIES_EDIT,
            PERMISSIONS.CATEGORIES_DELETE,
        ],

        ORDER_ACCESS: [
            PERMISSIONS.ORDERS_VIEW,
            PERMISSIONS.ORDERS_CREATE,
            PERMISSIONS.ORDERS_EDIT,
            PERMISSIONS.ORDERS_DELETE,
            PERMISSIONS.ORDERS_REFUND,
        ],

        EXPENSE_ACCESS: [
            PERMISSIONS.EXPENSES_VIEW,
            PERMISSIONS.EXPENSES_CREATE,
            PERMISSIONS.EXPENSES_EDIT,
            PERMISSIONS.EXPENSES_DELETE,
        ],

        VENDOR_ACCESS: [
            PERMISSIONS.VENDORS_VIEW,
            PERMISSIONS.VENDORS_CREATE,
            PERMISSIONS.VENDORS_EDIT,
            PERMISSIONS.VENDORS_DELETE,
        ],

        ADMIN_ACCESS: [
            PERMISSIONS.STORE_VIEW_USERS,
            PERMISSIONS.STORE_CREATE_USERS,
            PERMISSIONS.STORE_EDIT_USERS,
            PERMISSIONS.STORE_DELETE_USERS,
        ],

        CUSTOMER_ACCESS: [
            PERMISSIONS.CUSTOMERS_VIEW,
            PERMISSIONS.CUSTOMERS_CREATE,
            PERMISSIONS.CUSTOMERS_EDIT,
            PERMISSIONS.CUSTOMERS_DELETE,
        ],

        ROLE_ACCESS: [
            PERMISSIONS.ROLES_VIEW,
            PERMISSIONS.ROLES_CREATE,
            PERMISSIONS.ROLES_EDIT,
            PERMISSIONS.ROLES_DELETE,
            PERMISSIONS.ROLES_ASSIGN,
        ],

        SETTINGS_ACCESS: [
            PERMISSIONS.SETTINGS_VIEW,
            PERMISSIONS.SETTINGS_EDIT,
        ],

        BLOG_ACCESS: [
            PERMISSIONS.BLOGS_VIEW,
            PERMISSIONS.BLOGS_CREATE,
            PERMISSIONS.BLOGS_EDIT,
            PERMISSIONS.BLOGS_DELETE,
        ],

        MENU_ACCESS: [
            PERMISSIONS.MENUS_VIEW,
            PERMISSIONS.MENUS_CREATE,
            PERMISSIONS.MENUS_EDIT,
            PERMISSIONS.MENUS_DELETE,
        ],

        PAGE_ACCESS: [
            PERMISSIONS.PAGES_VIEW,
            PERMISSIONS.PAGES_CREATE,
            PERMISSIONS.PAGES_EDIT,
            PERMISSIONS.PAGES_DELETE,
        ],
    } as const;

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
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        PERMISSIONS,
        PERMISSION_GROUPS,
        canAccess,
        userPermissions,
        isStoreOwner,
        hasAnyPermissions: isStoreOwner || userPermissions.length > 0,
    };
};

export default usePermissions;