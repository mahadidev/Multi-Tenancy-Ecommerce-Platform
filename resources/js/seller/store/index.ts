import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "./reducers/authApi";
import { storeApi } from "./reducers/storeApi";
import authSlice from "./slices/authSlice";
import baseSlice from "./slices/baseSlice";

const authPersistConfig = {
    key: "site",
    blacklist: ["authApi"],
    storage,
};

const persistedReducer = persistReducer(
    authPersistConfig,
    combineReducers({
        base: baseSlice,
        auth: authSlice,
        [authApi.reducerPath]: authApi.reducer,
        [storeApi.reducerPath]: storeApi.reducer,
    })
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        }).concat([authApi.middleware, storeApi.middleware]);
    },
});

export const persistor = persistStore(store);
export default store;

// typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
