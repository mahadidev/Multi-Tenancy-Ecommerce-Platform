import { FaBlogger, FaPaintBrush, FaUsers, FaChartBar } from 'react-icons/fa';
import { HiChartPie, HiCog, HiShoppingBag } from 'react-icons/hi';
import { MdCollectionsBookmark, MdDeliveryDining } from 'react-icons/md';

import { RoutePath } from '@seller/seller_env';
import { SidebarItemType } from '@type/sidebarType';

export const defaultModePages: SidebarItemType[] = [
	{
		href: RoutePath.DashboardPage.index(),
		icon: HiChartPie,
		label: 'Dashboard',
	},
	{
		href: RoutePath.AnalyticsPage.index(),
		icon: FaChartBar,
		label: 'Analytics',
	},
	{
		icon: HiShoppingBag,
		label: 'E-commerce',
		items: [
			{ href: RoutePath.CategoriesPage.index(), label: 'Product Categories' },
			{ href: RoutePath.BrandsPage.index(), label: 'Brand' },

			{ href: RoutePath.ProductsPage.index(), label: 'Products' },
			{
				href: RoutePath.OrdersPage.index(),
				label: 'Orders',
			},
			{
				href: RoutePath.ShipmentOrdersPage.index(),
				label: 'Shipment Orders',
			},
		],
	},
	{
		href: RoutePath.CustomersPage.index(),
		icon: FaUsers,
		label: 'Customers',
	},
	{
		icon: FaBlogger,
		label: 'Blogs',
		items: [
			{ href: RoutePath.BlogsPage.categories(), label: 'Blog Categories' },
			{ href: RoutePath.BlogsPage.index(), label: 'Blogs' },
		],
	},
];

export const defaultModeExternalPages: SidebarItemType[] = [
	// {
	//     href: RoutePath.StoresPage.index(),
	//     icon: MdStore,
	//     label: "Stores",
	// },
	{
		href: RoutePath.StorePagesPage.index(),
		icon: MdCollectionsBookmark,
		label: 'Pages',
	},
	{
		icon: FaPaintBrush,
		label: 'Appearance',
		items: [
			{ href: RoutePath.ThemesPage.index(), label: 'Themes' },
			{ href: RoutePath.MenusPage.index(), label: 'Menus' },
		],
	},
	{
		icon: HiCog,
		label: 'Settings',
		items: [
			{ href: RoutePath.SettingsPage.index(), label: 'General' },
			{ href: RoutePath.AnalyticsPage.index(), label: 'Analytics' },
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
