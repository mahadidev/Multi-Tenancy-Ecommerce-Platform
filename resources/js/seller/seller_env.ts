// fetch from html
const document: {
    head: {
        querySelector: CallableFunction;
    };
} = window.document;
export const BASE_URL: string = document.head.querySelector(
    'meta[name="base-url"]'
)
    ? document.head.querySelector('meta[name="base-url"]').content
    : "http://localhost:8000";

// variables
export const PREFIX = "/seller";
export const BASE_IMAGE_URL = `${BASE_URL}/images`;
export const API_URL = BASE_URL + "/api/v1";
export const APP_NAME: string = document.head.querySelector(
    'meta[name="app-name"]'
)?.content;

export const RoutePath = {
	LoginPage: {
		index: () => '/login',
	},
	RegisterPage: {
		index: () => '/register',
	},
	ForgotPasswordPage: {
		index: () => '/forgot-password',
	},
	ForgotPasswordSuccessPage: {
		index: () => '/forgot-password-success',
	},
	MyAccountPage: {
		ProfileSettings: { index: () => '/my-account/profile-settings' },
	},
	Onboard: {
		Store: {
			index: () => '/onboard/store',
		},
	},
	DashboardPage: {
		index: () => '/',
	},
	OrdersPage: {
		index: () => '/orders',
	},
	ShipmentOrdersPage: {
		index: () => '/shipment-orders',
	},
	CustomersPage: {
		index: () => '/customers',
	},
	BrandsPage: {
		index: () => '/brands',
	},
	CategoriesPage: {
		index: () => '/categories',
	},
	ExpensesPage: {
		index: () => '/expenses',
	},
	VendorsPage: {
		index: () => '/vendors',
	},
	StorePagesPage: {
		index: () => '/pages',
		indexUrl: () => BASE_URL + PREFIX + `/pages`,
		edit: (pageId: number) => `/pages/${pageId}`,
		editUrl: (pageId: number) => BASE_URL + PREFIX + `/pages/${pageId}`,
	},
	StoresPage: {
		index: () => '/stores',
	},
	ProductsPage: {
		index: () => '/products',
		edit: (productId: number) => `/products/${productId}`,
	},
	AccessManagementPage: {
		index: () => '/access-management',
	},
	StoreAdminPage: {
		index: () => '/store-admin',
	},
	SettingsPage: {
		index: () => '/settings',
	},
	AnalyticsPage: {
		index: () => '/analytics',
		productStock: () => '/analytics/product-stock',
	},
	MenusPage: {
		index: () => '/menus',
	},
	BlogsPage: {
		index: () => '/blogs',
		categories: () => `/blogs/categories`,
		create: () => `/blogs/create`,
		edit: (blogId: number) => `/blogs/${blogId}`,
	},
	NotificationsPage: {
		index: () => '/notifications',
	},

	SubscriptionPage: {
		index: () => '/select-subscriptions',
	},
	SubscriptionSuccessPage: {
		index: () => '/subscriptions-success',
	},
	orderPlacer: {
		index: () => '/order-placer',
	},
};
