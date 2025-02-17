import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "./reducers/authApi";
import { blogApi } from "./reducers/blogApi";
import { brandApi } from "./reducers/brandApi";
import { cartApi } from "./reducers/cartApi";
import { categoryApi } from "./reducers/categoryApi";
import { customerApi } from "./reducers/customerApi";
import { dashboardAnalyticsApi } from "./reducers/dashboardAnalyticsApi";
import { fileApi } from "./reducers/fileApi";
import { menuApi } from "./reducers/menuApi";
import { notificationApi } from "./reducers/notificationApi";
import { orderApi } from "./reducers/orderApi";
import { pageApi } from "./reducers/pageApi";
import { productApi } from "./reducers/productApi";
import { rolePermissionApi } from "./reducers/rolePermissionsApi";
import { socialMediaApi } from "./reducers/socialMediaApi";
import { storeAdminApi } from "./reducers/storeAdminApi";
import { storeApi } from "./reducers/storeApi";
import { themeApi } from "./reducers/themeApi";
import AuthSlice from "./slices/authSlice";
import blogSlice from "./slices/blogSlice";
import brandSlice from "./slices/brandSlice";
import CartSlice from "./slices/cartSlice";
import categorySlice from "./slices/categorySlice";
import customerSlice from "./slices/customerSlice";
import DashboardAnalyticsSlice from "./slices/dashboardAnalyticsSlice";
import fileSlice from "./slices/fileSlice";
import MenuSlice from "./slices/menuSlice";
import notificationSlice from "./slices/notificationSlice";
import OrderSlice from "./slices/orderSlice";
import pageSlice from "./slices/pageSlice";
import productSlice from "./slices/productSlice";
import RolePermissionSlice from "./slices/rolePermissionsSlice";
import socialMediaSlice from "./slices/socialMediaSlice";
import StoreAdminSlice from "./slices/storeAdminSlice";
import StoreSlice from "./slices/storeSlice";
import themeSlice from "./slices/themeSlice";
import uiSlice from "./slices/uiSlice";
import widgetSlice from "./slices/widgetSlice";

const authPersistConfig = {
    key: "seller",
    blacklist: [
        "menuApi",
        "storeAdminApi",
        "rolePermissionsApi",
        "cartApi",
        "orderApi",
        "authApi",
        "dashboardAnalyticsApi",
        "fileApi",
        "themeApi",
        "storeApi",
        "categoryApi",
        "pageApi",
        "productApi",
        "blogApi",
        "brandApi",
        "socialMediaApi",
        "notificationApi",
        "customerApi",
    ],
    storage,
    version: 0,
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
        customer: customerSlice,
        [rolePermissionApi.reducerPath]: rolePermissionApi.reducer,
        [storeAdminApi.reducerPath]: storeAdminApi.reducer,
        [menuApi.reducerPath]: menuApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [customerApi.reducerPath]: customerApi.reducer,
        [dashboardAnalyticsApi.reducerPath]: dashboardAnalyticsApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
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
            storeAdminApi.middleware,
            rolePermissionApi.middleware,
            menuApi.middleware,
            authApi.middleware,
            cartApi.middleware,
            orderApi.middleware,
            customerApi.middleware,
            notificationApi.middleware,
            dashboardAnalyticsApi.middleware,
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
