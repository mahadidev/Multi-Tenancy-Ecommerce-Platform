import { RoutePath } from '@seller/seller_env';
import { SidebarItemType } from '@type/sidebarType';
import { FaBuilding, FaLayerGroup, FaSteamSymbol, FaUsers } from 'react-icons/fa';
import { HiChartPie, HiCog, HiShoppingBag } from 'react-icons/hi';
import { MdAttachMoney, MdBusiness } from 'react-icons/md';
import { TbCoinTakaFilled, TbTruckDelivery } from 'react-icons/tb';

export interface PermissionAwareSidebarItem extends SidebarItemType {
    /**
     * Required permission to show this item
     */
    permission?: string;

    /**
     * Array of permissions - user needs ANY of these (OR logic)
     */
    permissions?: string[];

    /**
     * Custom condition function for complex permission logic
     */
    condition?: (userPermissions: string[]) => boolean;
}

/**
 * Navigation items with permission requirements
 * Organized into logical groups based on business functions
 */
export const permissionAwarePages: PermissionAwareSidebarItem[] = [
	{
		href: RoutePath.DashboardPage.index(),
		icon: HiChartPie,
		label: 'Dashboard',
		permissions: ['analytics.view', 'reports.export'],
	},

	// Inventory Group
	{
		icon: HiShoppingBag,
		label: 'Inventory',
		permissions: [
			'products.view',
			'products.create',
			'products.edit',
			'products.delete',
			'products.manage_stock',
			'categories.view',
			'categories.create',
			'categories.edit',
			'categories.delete',
		],
		items: [
			{
				href: RoutePath.ProductsPage.index(),
				label: 'Products',
				permissions: [
					'products.view',
					'products.create',
					'products.edit',
					'products.delete',
					'products.manage_stock',
				],
			},
			{
				href: RoutePath.CategoriesPage.index(),
				label: 'Categories',
				permissions: [
					'categories.view',
					'categories.create',
					'categories.edit',
					'categories.delete',
				],
			},
		],
	},

	// Sales Group
	{
		icon: TbTruckDelivery,
		label: 'Sales',
		permissions: [
			'orders.view',
			'orders.create',
			'orders.edit',
			'orders.delete',
			'orders.refund',
			'customers.view',
			'customers.create',
			'customers.edit',
			'customers.delete',
		],
		items: [
			{
				href: RoutePath.OrdersPage.index(),
				label: 'Orders',
				permissions: [
					'orders.view',
					'orders.create',
					'orders.edit',
					'orders.delete',
					'orders.refund',
				],
			},
			{
				href: RoutePath.CustomersPage.index(),
				label: 'Customers',
				permissions: [
					'customers.view',
					'customers.create',
					'customers.edit',
					'customers.delete',
				],
			},
		],
	},

	// Finance Group
	{
		icon: TbCoinTakaFilled,
		label: 'Finance',
		permissions: [
			'expenses.view',
			'expenses.create',
			'expenses.edit',
			'expenses.delete',
			'vendors.view',
			'vendors.create',
			'vendors.edit',
			'vendors.delete',
			'reports.financial',
		],
		items: [
			{
				href: RoutePath.ExpensesPage.index(),
				label: 'Expenses',
				permissions: [
					'expenses.view',
					'expenses.create',
					'expenses.edit',
					'expenses.delete',
				],
			},
			{
				href: RoutePath.VendorsPage.index(),
				label: 'Vendors',
				permissions: [
					'vendors.view',
					'vendors.create',
					'vendors.edit',
					'vendors.delete',
				],
			},
		],
	},
];

export const permissionAwareExternalPages: PermissionAwareSidebarItem[] = [
    // Content Group
    {
        icon: FaLayerGroup,
        label: 'Content',
        permissions: [
            'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete',
            'menus.view', 'menus.create', 'menus.edit', 'menus.delete',
            'pages.view', 'pages.create', 'pages.edit', 'pages.delete'
        ],
        items: [
            {
                href: '#',
                label: 'Blogs',
                permissions: [
                    'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete'
                ],
            },
            {
                href: '#',
                label: 'Menus',
                permissions: [
                    'menus.view', 'menus.create', 'menus.edit', 'menus.delete'
                ],
            },
            {
                href: '#',
                label: 'Pages',
                permissions: [
                    'pages.view', 'pages.create', 'pages.edit', 'pages.delete'
                ],
            },
        ],
    },

    // Users Group
    {
        icon: FaUsers,
        label: 'Users',
        permissions: [
            'store.view_users', 'store.create_users', 'store.edit_users', 'store.delete_users',
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.assign',
            'permissions.view', 'permissions.edit'
        ],
        items: [
            {
                href: RoutePath.StoreAdminPage.index(),
                label: 'Store Users',
                permissions: [
                    'store.view_users', 'store.create_users', 'store.edit_users', 'store.delete_users'
                ],
            },
            {
                href: RoutePath.AccessManagementPage.index(),
                label: 'Roles & Permissions',
                permissions: [
                    'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.assign',
                    'permissions.view', 'permissions.edit'
                ],
            },
        ],
    },

    // Settings Group
    {
        icon: HiCog,
        label: 'Settings',
        permissions: [
            'settings.view', 'settings.edit',
            'analytics.view', 'reports.export'
        ],
        items: [
            {
                href: RoutePath.SettingsPage.index(),
                label: 'Store Settings',
                permissions: ['settings.view', 'settings.edit'],
            },
            {
                href: '#',
                label: 'Analytics',
                permissions: ['analytics.view', 'reports.export'],
            },
        ],
    },

    // Tools & Utilities
    {
        href: RoutePath.orderPlacer.index(),
        icon: FaSteamSymbol,
        label: 'Order Placer',
        permissions: [
            'orders.view', 'orders.create', 'orders.edit', 'orders.delete', 'orders.refund'
        ],
    },
];

/**
 * Filter navigation items based on user permissions
 * @param items - Array of navigation items to filter
 * @param userPermissions - Current user's permissions
 * @param isStoreOwner - Whether the user is the store owner
 * @returns Filtered array of navigation items
 */
export const filterNavigationByPermissions = (
    items: PermissionAwareSidebarItem[],
    userPermissions: string[],
    isStoreOwner: boolean = false
): SidebarItemType[] => {
    return items.filter(item => {
        // Store owners have access to everything
        if (isStoreOwner) {
            return true;
        }

        // Always show items with no permission requirements
        if (!item.permission && !item.permissions && !item.condition) {
            return true;
        }

        // Check custom condition
        if (item.condition) {
            return item.condition(userPermissions);
        }

        // Check single permission
        if (item.permission) {
            return userPermissions.includes(item.permission);
        }

        // Check if user has any of the required permissions (OR logic)
        if (item.permissions) {
            return item.permissions.some(permission =>
                userPermissions.includes(permission)
            );
        }

        return false;
    }).map(item => {
        // If item has sub-items, filter those too
        if (item.items) {
            const filteredSubItems = filterNavigationByPermissions(
                item.items as PermissionAwareSidebarItem[],
                userPermissions,
                isStoreOwner
            );

            // Only show parent item if it has visible sub-items
            if (filteredSubItems.length === 0) {
                return null;
            }

            return {
                ...item,
                items: filteredSubItems,
            };
        }

        return item;
    }).filter(Boolean) as SidebarItemType[];
};

/**
 * Get filtered navigation items for the current user
 * @param userPermissions - Current user's permissions
 * @param isStoreOwner - Whether the user is the store owner
 * @returns Object containing filtered pages and external pages
 */
export const getPermissionAwareNavigation = (userPermissions: string[], isStoreOwner: boolean = false) => {
    return {
        pages: filterNavigationByPermissions(permissionAwarePages, userPermissions, isStoreOwner),
        externalPages: filterNavigationByPermissions(permissionAwareExternalPages, userPermissions, isStoreOwner),
    };
};
