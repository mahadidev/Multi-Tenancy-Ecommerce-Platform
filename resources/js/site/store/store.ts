import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authApi } from './reducers/authApi';
import { storeApi } from './reducers/storeApi';
import { userApi } from "./reducers/userApi";
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import storeSlice from './slices/storeSlice';

const authPersistConfig = {
	key: 'site',
	blacklist: ['storeApi', 'authApi', 'userApi'],
	storage,
	version: 0,
};

const persistedReducer = persistReducer(
	authPersistConfig,
	combineReducers({
		store: storeSlice,
		auth: authSlice,
        cart: cartSlice,
		[storeApi.reducerPath]: storeApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[userApi.reducerPath]: userApi.reducer
	})
);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: false,
		}).concat([storeApi.middleware, authApi.middleware, userApi.middleware]);
	},
});

export const persistor = persistStore(store);
export default store;

// typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
