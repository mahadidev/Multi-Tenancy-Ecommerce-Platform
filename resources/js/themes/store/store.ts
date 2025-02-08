import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authApi } from './reducers/authApi';
import { cartApi } from './reducers/cartApi';
import { themeApi } from './reducers/themeApi';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import storeSlice from './slices/storeSlice';
import themeSlice from "./slices/themeSlice";
import uiSlice from "./slices/uiSlice";


const authPersistConfig = {
	key: 'themes',
	blacklist: ['themeApi', 'authApi', 'cartApi'],
	storage,
	version: 0,
};

const persistedReducer = persistReducer(
	authPersistConfig,
	combineReducers({
		theme: themeSlice,
		store: storeSlice,
		ui: uiSlice,
		cart: cartSlice,
		auth: authSlice,
		[themeApi.reducerPath]: themeApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[cartApi.reducerPath]: cartApi.reducer,
	})
);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: false,
		}).concat([
			themeApi.middleware,
			authApi.middleware,
			cartApi.middleware,
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
