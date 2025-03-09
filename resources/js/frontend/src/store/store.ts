import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { subscriptionPlanApi } from "./reducers/subscriptionPlanApi";
import subscriptionPlanSlice from "./slices/subscriptionPlanSlice";

const authPersistConfig = {
    key: "frontend",
    blacklist: ["subscriptionPlansApi"],
    storage,
    version: 0,
};

const persistedReducer = persistReducer(
    authPersistConfig,
    combineReducers({
        plans: subscriptionPlanSlice,
        [subscriptionPlanApi.reducerPath]: subscriptionPlanApi.reducer,
    })
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        }).concat([subscriptionPlanApi.middleware]);
    },
});

export const persistor = persistStore(store);
export default store;

// typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
