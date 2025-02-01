import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "./reducers/authApi";
import { blogApi } from "./reducers/blogApi";
import { brandApi } from "./reducers/brandApi";
import { categoryApi } from "./reducers/categoryApi";
import { fileApi } from "./reducers/fileApi";
import { pageApi } from "./reducers/pageApi";
import { productApi } from "./reducers/productApi";
import { socialMediaApi } from "./reducers/socialMediaApi";
import { storeApi } from "./reducers/storeApi";
import { themeApi } from "./reducers/themeApi";
import AuthSlice from "./slices/authSlice";
import blogSlice from "./slices/blogSlice";
import brandSlice from "./slices/brandSlice";
import categorySlice from "./slices/categorySlice";
import fileSlice from "./slices/fileSlice";
import notificationSlice from './slices/notificationSlice';
import pageSlice from "./slices/pageSlice";
import productSlice from "./slices/productSlice";
import socialMediaSlice from "./slices/socialMediaSlice";
import storeSlice from "./slices/storeSlice";
import themeSlice from "./slices/themeSlice";
import uiSlice from "./slices/uiSlice";
import widgetSlice from "./slices/widgetSlice";

const authPersistConfig = {
    key: "seller",
    blacklist: [
        "authApi",
        "fileApi",
        "themeApi",
        "storeApi",
        "categoryApi",
        "pageApi",
        "productApi",
        "blogApi",
        "brandApi",
        "socialMediaApi",
        'notification'
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
        blog: blogSlice,
        page: pageSlice,
        product: productSlice,
        brand: brandSlice,
        socialMedia: socialMediaSlice,
        widget: widgetSlice,
        notification: notificationSlice,
        [authApi.reducerPath]: authApi.reducer,
        [fileApi.reducerPath]: fileApi.reducer,
        [themeApi.reducerPath]: themeApi.reducer,
        [storeApi.reducerPath]: storeApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [blogApi.reducerPath]: blogApi.reducer,
        [pageApi.reducerPath]: pageApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [brandApi.reducerPath]: brandApi.reducer,
        [socialMediaApi.reducerPath]: socialMediaApi.reducer,
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
            blogApi.middleware,
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
