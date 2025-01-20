import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "./reducers/authApi";
import { brandApi } from "./reducers/brandApi";
import { categoryApi } from "./reducers/categoryApi";
import { imageApi } from "./reducers/imageApi";
import { pageApi } from "./reducers/pageApi";
import { productApi } from "./reducers/productApi";
import { socialMediaApi } from "./reducers/socialMediaApi";
import { storeApi } from "./reducers/storeApi";
import { themeApi } from "./reducers/themeApi";
import { widgetApi } from "./reducers/widgetApi";
import authSlice from "./slices/authSlice";
import baseSlice from "./slices/baseSlice";
import brandSlice from "./slices/brandSlice";
import categorySlice from "./slices/categorySlice";
import imageUploaderSlice from "./slices/imageUploaderSlice";
import pageSlice from "./slices/pageSlice";
import productSlice from "./slices/productSlice";
import settingSlice from "./slices/settingSlice";
import socialMediaSlice from "./slices/socialMediaSlice";
import storeOnboardSlice from "./slices/storeOnboardSlice";
import storeSlice from "./slices/storeSlice";
import themeSlice from "./slices/themeSlice";

const authPersistConfig = {
    key: "site",
    blacklist: [
        "authApi",
        "storeApi",
        "themeApi",
        "pageApi",
        "imageApi",
        "categoryApi",
        "productApi",
        "brandApi",
        "widgetApi",
        "socialMediaApi",
    ],
    storage,
    version: 0,
};

const persistedReducer = persistReducer(
    authPersistConfig,
    combineReducers({
        base: baseSlice,
        auth: authSlice,
        store: storeSlice,
        storeOnboard: storeOnboardSlice,
        settingSlice: settingSlice,
        page: pageSlice,
        imageUploader: imageUploaderSlice,
        category: categorySlice,
        brand: brandSlice,
        theme: themeSlice,
        product: productSlice,
        socialMedia: socialMediaSlice,
        [authApi.reducerPath]: authApi.reducer,
        [storeApi.reducerPath]: storeApi.reducer,
        [themeApi.reducerPath]: themeApi.reducer,
        [pageApi.reducerPath]: pageApi.reducer,
        [widgetApi.reducerPath]: widgetApi.reducer,
        [imageApi.reducerPath]: imageApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [brandApi.reducerPath]: brandApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
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
            storeApi.middleware,
            themeApi.middleware,
            pageApi.middleware,
            widgetApi.middleware,
            imageApi.middleware,
            categoryApi.middleware,
            brandApi.middleware,
            productApi.middleware,
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
