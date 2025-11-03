import { FaBlogger, FaLayerGroup, FaSteamSymbol, FaUsers, FaChartBar } from 'react-icons/fa';
import { HiChartPie, HiCog, HiShoppingBag } from 'react-icons/hi';
import { MdAttachMoney, MdWeb } from 'react-icons/md';

import { RoutePath } from '@seller/seller_env';
import { SidebarItemType } from '@type/sidebarType';
import { TbTruckDelivery } from 'react-icons/tb';

export const ecommerceModePages: SidebarItemType[] = [
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
		href: RoutePath.CategoriesPage.index(),
		label: 'Product Categories',
		icon: FaLayerGroup,
	},
	{
		href: RoutePath.ProductsPage.index(),
		label: 'Products',
		icon: HiShoppingBag,
	},
	{
		icon: FaBlogger,
		label: 'Blogs',
		items: [
			{ href: RoutePath.BlogsPage.categories(), label: 'Blog Categories' },
			{ href: RoutePath.BlogsPage.index(), label: 'All Blogs' },
		],
	},
	{
		icon: MdAttachMoney,
		label: 'Expenses',
		items: [
			{ href: RoutePath.ExpensesPage.index(), label: 'All Expenses' },
			{ href: RoutePath.VendorsPage.index(), label: 'Vendors' },
		],
	},
	{
		href: RoutePath.CustomersPage.index(),
		icon: FaUsers,
		label: 'Customers',
	},
	{
		href: RoutePath.OrdersPage.index(),
		icon: TbTruckDelivery,
		label: 'Orders',
	},
];

export const ecommerceModeExternalPages: SidebarItemType[] = [
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
		icon: FaSteamSymbol,
		label: 'Order Placer',
	},
];
