export { default as BrandsPage } from "./Brands/BrandsPage";
export { default as CategoriesPage } from "./Categories/CategoriesPage";
export { default as DashboardPage } from "./Dashboard/DashboardPage";
export { default as SettingsPage } from "./Settings/SettingsPage";

// auth pages
export { default as LoginPage } from './Auth/LoginPage';
export { default as RegisterPage } from './Auth/RegisterPage';

// products pages
export { default as ProductEditPage } from './Products/ProductEdit/ProductEditPage';
export { default as ProductsPage } from './Products/ProductsPage';

// store pages pages
export { default as StorePagesEditPage } from './StorePages/StorePagesEdit/StorePagesEditPage';
export { default as StorePagesPage } from './StorePages/StorePagesPage';

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


