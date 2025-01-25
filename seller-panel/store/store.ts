import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authApi } from '@seller-panel/store/reducers/authApi';
import { brandApi } from '@seller-panel/store/reducers/brandApi';
import { categoryApi } from '@seller-panel/store/reducers/categoryApi';
import { fileApi } from '@seller-panel/store/reducers/fileApi';
import { pageApi } from '@seller-panel/store/reducers/pageApi';
import { productApi } from '@seller-panel/store/reducers/productApi';
import { storeApi } from '@seller-panel/store/reducers/storeApi';
import { themeApi } from '@seller-panel/store/reducers/themeApi';
import AuthSlice from '@seller-panel/store/slices/authSlice';
import brandSlice from '@seller-panel/store/slices/brandSlice';
import categorySlice from '@seller-panel/store/slices/categorySlice';
import fileSlice from '@seller-panel/store/slices/fileSlice';
import pageSlice from '@seller-panel/store/slices/pageSlice';
import productSlice from '@seller-panel/store/slices/productSlice';
import socialMediaSlice from '@seller-panel/store/slices/socialMediaSlice';
import storeSlice from '@seller-panel/store/slices/storeSlice';
import themeSlice from '@seller-panel/store/slices/themeSlice';
import uiSlice from '@seller-panel/store/slices/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { socialMediaApi } from './reducers/socialMediaApi';

const authPersistConfig = {
	key: '@seller-panel',
	blacklist: [
		'authApi',
		'fileApi',
		'themeApi',
		'storeApi',
		'categoryApi',
		'pageApi',
		'productApi',
		'brandApi',
		'socialMediaApi',
	],
	storage,
	version: 0,
};

const persistedReducer = persistReducer(
	authPersistConfig,
	combineReducers({
		auth: AuthSlice,
		store: storeSlice,
		file: fileSlice,
		theme: themeSlice,
		ui: uiSlice,
		category: categorySlice,
		page: pageSlice,
		product: productSlice,
		brand: brandSlice,
        socialMedia: socialMediaSlice,
		[authApi.reducerPath]: authApi.reducer,
		[fileApi.reducerPath]: fileApi.reducer,
		[themeApi.reducerPath]: themeApi.reducer,
		[storeApi.reducerPath]: storeApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[pageApi.reducerPath]: pageApi.reducer,
		[productApi.reducerPath]: productApi.reducer,
		[brandApi.reducerPath]: brandApi.reducer,
        [socialMediaApi.reducerPath]: socialMediaApi.reducer
	})
);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: false,
		}).concat([
			authApi.middleware,
			fileApi.middleware,
			themeApi.middleware,
			storeApi.middleware,
			categoryApi.middleware,
			pageApi.middleware,
			productApi.middleware,
			brandApi.middleware,
			socialMediaApi.middleware,
		]);
	},
});

export const persistor = persistStore(store);
export default store;

// typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
