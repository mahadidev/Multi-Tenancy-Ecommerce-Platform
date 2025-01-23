export { default as BrandsPage } from "./BrandsPage/BrandsPage";
export { default as CategoriesPage } from "./CategoriesPage/CategoriesPage";
export { default as DashboardPage } from "./DashboardPage/DashboardPage";
export { default as SettingsPage } from "./SettingsPage/SettingsPage";

// auth pages
export { default as LoginPage } from './AuthPage/LoginPage';
export { default as RegisterPage } from './AuthPage/RegisterPage';

// products pages
export { default as ProductEditPage } from './ProductsPage/ProductEdit/ProductEditPage';
export { default as ProductsPage } from './ProductsPage/ProductsPage';

// store pages pages
export { default as StorePagesEditPage } from './StorePage/StorePagesEdit/StorePagesEditPage';
export { default as StorePagesPage } from './StorePage/StorePagesPage';

// onboard pages
export { default as StoreOnboardPage } from "./OnboardPage/StoreOnboardPage/StoreOnboardPage";


// path
export const Path = {
	LoginPage: {
		index: () => '/login',
	},
	RegisterPage: {
		index: () => '/register',
	},
    Onboard: {
        Store: {
            index: () => "/onboard/store"
        }
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
		edit: (pageId: number) => `/pages/${pageId}`,
	},
	ProductsPage: {
		index: () => '/products',
		edit: (productId: number) => `/products/${productId}`,
	},
	SettingsPage: {
		index: () => '/settings',
	},
};


