import { FaBlogger, FaLayerGroup, FaPaintBrush, FaUsers } from 'react-icons/fa';
import { HiChartPie, HiCog, HiShoppingBag } from 'react-icons/hi';
import { MdCollectionsBookmark, MdDeliveryDining } from 'react-icons/md';

import { RoutePath } from '@seller/seller_env';
import { SidebarItemType } from '@type/sidebarType';

export const ecommerceModePages: SidebarItemType[] = [
	{
		href: RoutePath.DashboardPage.index(),
		icon: HiChartPie,
		label: 'Dashboard',
	},
	{
		href: RoutePath.CategoriesPage.index(),
		label: 'Category',
		icon: FaLayerGroup,
	},
	{
		href: RoutePath.ProductsPage.index(),
		label: 'Products',
		icon: HiShoppingBag,
	},
	{
		href: RoutePath.CustomersPage.index(),
		icon: FaUsers,
		label: 'Customers',
	}
];

export const ecommerceModeExternalPages: SidebarItemType[] = [
	{
		icon: HiCog,
		label: 'Settings',
		items: [
			{ href: RoutePath.SettingsPage.index(), label: 'General' },
			{
				href: RoutePath.AccessManagementPage.index(),
				label: 'Access Management',
			},
			{
				href: RoutePath.StoreAdminPage.index(),
				label: 'Store Admin',
			},
		],
	},
	{
		href: RoutePath.orderPlacer.index(),
		icon: MdDeliveryDining,
		label: 'Order Placer',
	},
];
