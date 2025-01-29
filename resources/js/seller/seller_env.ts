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
	: 'http://localhost:8000';

// variables
export const PREFIX = '/seller';
export const BASE_IMAGE_URL = `${BASE_URL}/images`;
export const API_URL = BASE_URL + '/api/v1';
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
	BrandsPage: {
		index: () => '/brands',
	},
	CategoriesPage: {
		index: () => '/categories',
	},
	StorePagesPage: {
		index: () => '/pages',
		indexUrl: () => BASE_URL + PREFIX + `/pages`,
		edit: (pageId: number) => `/pages/${pageId}`,
		editUrl: (pageId: number) => BASE_URL + PREFIX + `/pages/${pageId}`,
	},
	ProductsPage: {
		index: () => '/products',
		edit: (productId: number) => `/products/${productId}`,
	},
	BlogsPage: {
		index: () => '/blogs',
		categories: () => `/blogs/categories`,
		create: () => `/blogs/create`,
		edit: (blogId: number) => `/blogs/${blogId}`,
	},
	SettingsPage: {
		index: () => '/settings',
	},
	ThemesPage: {
		index: () => '/themes',
	},
};
