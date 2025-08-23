import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Modular APIs - Using new module structure
import { accessManagementApi, accessManagementSlice } from '../modules/AccessManagement/store';
import { authApi, authSlice } from '../modules/Auth/store';
import { blogApi, blogSlice } from '../modules/Blog/store';
import { brandApi, brandSlice } from '../modules/Brand/store';
import { cartOrderPlacerApi, cartOrderPlacerSlice } from '../modules/CartOrderPlacer/store';
import { categoryApi, categorySlice } from '../modules/Category/store';
import { customerApi, customerSlice } from '../modules/Customer/store';
import { dashboardApi, dashboardSlice } from '../modules/Dashboard/store';
import { expenseApi, expenseSlice } from '../modules/Expense/store';
import { fileManagementApi, fileManagementSlice } from '../modules/FileManagement/store';
import { menuApi, menuSlice } from '../modules/Menu/store';
import { notificationApi, notificationSlice } from '../modules/Notification/store';
import { onboardApi, onboardSlice } from '../modules/Onboard/store';
import { orderApi, orderSlice } from '../modules/Order/store';
import { pageApi, pageSlice } from '../modules/Page/store';
import { placeholdersApi, placeholdersSlice } from '../modules/Placeholders/store';
import { productApi, productSlice } from '../modules/Product/store';
import { productStockApi, productStockSlice } from '../modules/ProductStock/store';
import { productVariantApi, productVariantSlice } from '../modules/ProductVariant/store';
import { profileApi, profileSlice } from '../modules/Profile/store';
import { settingsApi, settingsSlice } from '../modules/Settings/store';
import { socialMediaApi, socialMediaSlice } from '../modules/SocialMedia/store';
import { stockReportApi, stockReportSlice } from '../modules/StockReport/store';
import { storeApi, storeSlice } from '../modules/Store/store';
import { subscriptionApi, subscriptionSlice } from '../modules/Subscription/store';
import { themeApi, themeSlice } from '../modules/Theme/store';
import { websiteBuilderApi, websiteBuilderSlice } from '../modules/WebsiteBuilder/store';

// UI and utility slices that don't have modules
import orderPlacerSlice from './slices/orderPlacerSlice';
import productStockHistorySlice from './slices/productStockHistorySlice';
import subscriptionPlanSlice from './slices/subscriptionPlanSlice';
import uiSlice from './slices/uiSlice';
import widgetSlice from './slices/widgetSlice';

// Legacy APIs that need to be imported
import { fileApi } from './reducers/fileApi';
import { productStockHistoryApi } from './reducers/productStockHistoryApi';
import { rolePermissionApi } from './reducers/rolePermissionsApi';
import { subscriptionPlanApi } from './reducers/subscriptionPlanApi';
import { vendorApi } from './reducers/vendorApi';
import fileSlice from './slices/fileSlice';
import rolePermissionsSlice from './slices/rolePermissionsSlice';
import vendorSlice from './slices/vendorSlice';

const authPersistConfig = {
	key: 'seller',
	blacklist: [
		// Modular API blacklist - exclude API states from persistence
		'authApi',
		'accessManagementApi',
		'blogApi',
		'brandApi',
		'categoryApi',
		'customerApi',
		'dashboardApi',
		'expenseApi',
		'fileManagementApi',
		'menuApi',
		'notificationApi',
		'orderApi',
		'pageApi',
		'productApi',
		'productStockApi',
		'productVariantApi',
		'cartOrderPlacerApi',
		'socialMediaApi',
		'storeApi',
		'subscriptionApi',
		'themeApi',
		'settingsApi',
		'profileApi',
		'onboardApi',
		'placeholdersApi',
		'stockReportApi',
		'fileApi', // Added file API
		'productStockHistoryApi', // Added legacy API
		'rolePermissionsApi', // Added role permissions API
		'subscriptionPlansApi', // Added subscription plan API
		'vendorApi', // Added vendor API
		'websiteBuilderApi',
	],
	storage,
	version: 1, // Incremented version to force state reset
	migrate: (state: any) => {
		// This will reset the state when version changes
		if (state && state._persist && state._persist.version !== 1) {
			// Return undefined to reset state
			return Promise.resolve(undefined);
		}
		return Promise.resolve(state);
	},
};

const persistedReducer = persistReducer(
	authPersistConfig,
	combineReducers({
		// Modular State Slices - Using new module structure
		auth: authSlice,
		accessManagement: accessManagementSlice,
		blog: blogSlice,
		brand: brandSlice,
		category: categorySlice,
		customer: customerSlice,
		dashboard: dashboardSlice,
		expense: expenseSlice,
		fileManagement: fileManagementSlice,
		menu: menuSlice,
		notification: notificationSlice,
		order: orderSlice,
		page: pageSlice,
		product: productSlice,
		productStock: productStockSlice,
		productVariant: productVariantSlice,
		cartOrderPlacer: cartOrderPlacerSlice,
		socialMedia: socialMediaSlice,
		store: storeSlice,
		subscription: subscriptionSlice,
		theme: themeSlice,
		settings: settingsSlice,
		profile: profileSlice,
		onboard: onboardSlice,
		placeholders: placeholdersSlice,
		stockReport: stockReportSlice,
		websiteBuilder: websiteBuilderSlice,

		// UI and utility slices that don't have modules yet
		ui: uiSlice,
		widget: widgetSlice,
		orderPlacer: orderPlacerSlice,
		file: fileSlice, // Added file slice
		productStockHistory: productStockHistorySlice, // Added legacy slice
		rolePermissions: rolePermissionsSlice, // Added role permissions slice
		vendor: vendorSlice, // Added vendor slice
		subscriptionPlan: subscriptionPlanSlice, // Added subscription plan slice

		// Modular API Reducers - Using new module structure
		[authApi.reducerPath]: authApi.reducer,
		[accessManagementApi.reducerPath]: accessManagementApi.reducer,
		[blogApi.reducerPath]: blogApi.reducer,
		[brandApi.reducerPath]: brandApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[customerApi.reducerPath]: customerApi.reducer,
		[dashboardApi.reducerPath]: dashboardApi.reducer,
		[expenseApi.reducerPath]: expenseApi.reducer,
		[fileManagementApi.reducerPath]: fileManagementApi.reducer,
		[menuApi.reducerPath]: menuApi.reducer,
		[notificationApi.reducerPath]: notificationApi.reducer,
		[orderApi.reducerPath]: orderApi.reducer,
		[pageApi.reducerPath]: pageApi.reducer,
		[productApi.reducerPath]: productApi.reducer,
		[productStockApi.reducerPath]: productStockApi.reducer,
		[productVariantApi.reducerPath]: productVariantApi.reducer,
		[cartOrderPlacerApi.reducerPath]: cartOrderPlacerApi.reducer,
		[socialMediaApi.reducerPath]: socialMediaApi.reducer,
		[storeApi.reducerPath]: storeApi.reducer,
		[subscriptionApi.reducerPath]: subscriptionApi.reducer,
		[themeApi.reducerPath]: themeApi.reducer,
		[settingsApi.reducerPath]: settingsApi.reducer,
		[profileApi.reducerPath]: profileApi.reducer,
		[onboardApi.reducerPath]: onboardApi.reducer,
		[placeholdersApi.reducerPath]: placeholdersApi.reducer,
		[stockReportApi.reducerPath]: stockReportApi.reducer,
		[fileApi.reducerPath]: fileApi.reducer, // Added file API
		[productStockHistoryApi.reducerPath]: productStockHistoryApi.reducer, // Added legacy API
		[rolePermissionApi.reducerPath]: rolePermissionApi.reducer, // Added role permissions API
		[subscriptionPlanApi.reducerPath]: subscriptionPlanApi.reducer, // Added subscription plan API
		[vendorApi.reducerPath]: vendorApi.reducer, // Added vendor API
		[websiteBuilderApi.reducerPath]: websiteBuilderApi.reducer,
	})
);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: {
				// Disable for performance in development when state gets large
				warnAfter: 128, // Increase warning threshold from 32ms to 128ms
				ignoredPaths: ['productStock', 'dashboard', 'stockReport'], // Ignore large data states
			},
		}).concat([
			// Modular API Middleware - Using new module structure
			authApi.middleware,
			accessManagementApi.middleware,
			blogApi.middleware,
			brandApi.middleware,
			categoryApi.middleware,
			customerApi.middleware,
			dashboardApi.middleware,
			expenseApi.middleware,
			fileManagementApi.middleware,
			menuApi.middleware,
			notificationApi.middleware,
			orderApi.middleware,
			pageApi.middleware,
			productApi.middleware,
			productStockApi.middleware,
			productVariantApi.middleware,
			cartOrderPlacerApi.middleware,
			socialMediaApi.middleware,
			storeApi.middleware,
			subscriptionApi.middleware,
			themeApi.middleware,
			settingsApi.middleware,
			profileApi.middleware,
			onboardApi.middleware,
			placeholdersApi.middleware,
			stockReportApi.middleware,
			fileApi.middleware, // Added file API middleware
			productStockHistoryApi.middleware, // Added legacy API middleware
			rolePermissionApi.middleware, // Added role permissions API middleware
			subscriptionPlanApi.middleware, // Added subscription plan API middleware
			vendorApi.middleware, // Added vendor API middleware
			websiteBuilderApi.middleware,
		]),
});

export const persistor = persistStore(store);
export default store;

// typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
