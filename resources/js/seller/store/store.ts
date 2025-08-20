import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Existing APIs
import { authApi } from './reducers/authApi';
import { blogApi } from './reducers/blogApi';
import { brandApi } from './reducers/brandApi';
import { cartApi } from './reducers/cartApi';
import { categoryApi } from './reducers/categoryApi';
import { customerApi } from './reducers/customerApi';
import { dashboardAnalyticsApi } from './reducers/dashboardAnalyticsApi';
import { expenseApi } from './reducers/expenseApi';
import { fileApi } from './reducers/fileApi';
import { menuApi } from './reducers/menuApi';
import { notificationApi } from './reducers/notificationApi';
import { orderApi } from './reducers/orderApi';
import { salesChartApi } from './reducers/salesChartApi';
import { pageApi } from './reducers/pageApi';
import { productApi } from './reducers/productApi';
import { productStockApi } from './reducers/productStockApi';
import { productStocksApi } from './reducers/productStocksApi';
import { productVariantApi } from './reducers/productVariantApi';
import { rolePermissionApi } from './reducers/rolePermissionsApi';
import { socialMediaApi } from './reducers/socialMediaApi';
import { storeAdminApi } from './reducers/storeAdminApi';
import { storeApi } from './reducers/storeApi';
import { subscriptionPlanApi } from './reducers/subscriptionPlanApi';
import { themeApi } from './reducers/themeApi';
import { vendorApi } from './reducers/vendorApi';

// Slices
import { productStockHistoryApi } from './reducers/productStockHistoryApi';
import AuthSlice from './slices/authSlice';
import blogSlice from './slices/blogSlice';
import brandSlice from './slices/brandSlice';
import CartSlice from './slices/cartSlice';
import categorySlice from './slices/categorySlice';
import customerSlice from './slices/customerSlice';
import DashboardAnalyticsSlice from './slices/dashboardAnalyticsSlice';
import expenseSlice from './slices/expenseSlice';
import fileSlice from './slices/fileSlice';
import MenuSlice from './slices/menuSlice';
import notificationSlice from './slices/notificationSlice';
import orderPlacerSlice from './slices/orderPlacerSlice';
import OrderSlice from './slices/orderSlice';
import pageSlice from './slices/pageSlice';
import productSlice from './slices/productSlice';
import productStockHistorySlice from './slices/productStockHistorySlice';
import productStockSlice from './slices/productStockSlice';
import productStocksSlice from './slices/productStocksSlice';
import productVariantSlice from './slices/productVariantSlice';
import RolePermissionSlice from './slices/rolePermissionsSlice';
import socialMediaSlice from './slices/socialMediaSlice';
import StoreAdminSlice from './slices/storeAdminSlice';
import StoreSlice from './slices/storeSlice';
import SubscriptionPlanSlice from './slices/subscriptionPlanSlice';
import themeSlice from './slices/themeSlice';
import uiSlice from './slices/uiSlice';
import vendorSlice from './slices/vendorSlice';
import widgetSlice from './slices/widgetSlice';
import salesChartSlice from './slices/salesChartSlice';

const authPersistConfig = {
	key: 'seller',
	blacklist: [
		'orderPlacer',
		'menuApi',
		'storeAdminApi',
		'rolePermissionsApi',
		'cartApi',
		'orderApi',
		'authApi',
		'dashboardAnalyticsApi',
		'salesChartApi',
		'expenseApi',
		'fileApi',
		'themeApi',
		'storeApi',
		'categoryApi',
		'pageApi',
		'productApi',
		'productVariantApi',
		'productStockApi',
		'productStocksApi',
		'productStockHistoryApi',
		'blogApi',
		'brandApi',
		'socialMediaApi',
		'notificationApi',
		'customerApi',
		'subscriptionPlansApi',
		'vendorApi',
	],
	storage,
	version: 0.1,
};

const persistedReducer = persistReducer(
	authPersistConfig,
	combineReducers({
		auth: AuthSlice,
		storeAdmin: StoreAdminSlice,
		order: OrderSlice,
		menu: MenuSlice,
		rolePermission: RolePermissionSlice,
		cart: CartSlice,
		analytics: DashboardAnalyticsSlice,
		store: StoreSlice,
		expense: expenseSlice,
		file: fileSlice,
		theme: themeSlice,
		ui: uiSlice,
		category: categorySlice,
		blog: blogSlice,
		page: pageSlice,
		product: productSlice,
		productVariant: productVariantSlice,
		productStock: productStockSlice,
		productStocks: productStocksSlice,
        productStockHistory: productStockHistorySlice,
		brand: brandSlice,
		socialMedia: socialMediaSlice,
		widget: widgetSlice,
		notification: notificationSlice,
		customer: customerSlice,
		plans: SubscriptionPlanSlice,
		orderPlacer: orderPlacerSlice,
		vendor: vendorSlice,
		salesChart: salesChartSlice,

		// API reducers
		[subscriptionPlanApi.reducerPath]: subscriptionPlanApi.reducer,
		[rolePermissionApi.reducerPath]: rolePermissionApi.reducer,
		[storeAdminApi.reducerPath]: storeAdminApi.reducer,
		[menuApi.reducerPath]: menuApi.reducer,
		[cartApi.reducerPath]: cartApi.reducer,
		[customerApi.reducerPath]: customerApi.reducer,
		[dashboardAnalyticsApi.reducerPath]: dashboardAnalyticsApi.reducer,
		[notificationApi.reducerPath]: notificationApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[orderApi.reducerPath]: orderApi.reducer,
		[expenseApi.reducerPath]: expenseApi.reducer,
		[fileApi.reducerPath]: fileApi.reducer,
		[themeApi.reducerPath]: themeApi.reducer,
		[storeApi.reducerPath]: storeApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[blogApi.reducerPath]: blogApi.reducer,
		[pageApi.reducerPath]: pageApi.reducer,
		[productApi.reducerPath]: productApi.reducer,
		[productVariantApi.reducerPath]: productVariantApi.reducer,
		[productStockApi.reducerPath]: productStockApi.reducer,
		[productStocksApi.reducerPath]: productStocksApi.reducer,
        [productStockHistoryApi.reducerPath]: productStockHistoryApi.reducer,
		[brandApi.reducerPath]: brandApi.reducer,
		[socialMediaApi.reducerPath]: socialMediaApi.reducer,
		[vendorApi.reducerPath]: vendorApi.reducer,
		[salesChartApi.reducerPath]: salesChartApi.reducer,
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
				ignoredPaths: ['productStockHistory', 'salesChart'], // Ignore large data states
			},
		}).concat([
			storeAdminApi.middleware,
			rolePermissionApi.middleware,
			menuApi.middleware,
			authApi.middleware,
			cartApi.middleware,
			orderApi.middleware,
			customerApi.middleware,
			notificationApi.middleware,
			dashboardAnalyticsApi.middleware,
			expenseApi.middleware,
			fileApi.middleware,
			themeApi.middleware,
			storeApi.middleware,
			categoryApi.middleware,
			pageApi.middleware,
			productApi.middleware,
			productVariantApi.middleware,
			productStockApi.middleware,
			productStocksApi.middleware,
            productStockHistoryApi.middleware,
			blogApi.middleware,
			brandApi.middleware,
			socialMediaApi.middleware,
			subscriptionPlanApi.middleware,
			vendorApi.middleware,
			salesChartApi.middleware,
		]),
});

export const persistor = persistStore(store);
export default store;

// typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
