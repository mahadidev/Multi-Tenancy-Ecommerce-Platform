import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RoutePath } from "./env";
import { useAppDispatch, useAppSelector } from "./store";
import { useFetchStoresQuery } from "./store/reducers/storeApi";
import { setStoreResponse } from "./store/slices/storeSlice";

export const SellerDashboardMiddleware = () => {
    const { currentStore } = useAppSelector((state) => state.store);

    return currentStore ? <Outlet /> : <Navigate to={RoutePath.storeOnboard} />;
};

export const LoggedMiddleware = () => {
    const dispatch = useAppDispatch();

    const { data: storesData, isLoading: isStoreLoading } =
        useFetchStoresQuery();

    useEffect(() => {
        if (storesData) {
            dispatch(
                setStoreResponse({
                    stores: storesData.data.stores,
                    currentStore: storesData.data.current_store,
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStoreLoading, storesData]);

    const { user, accessToken } = useAppSelector((state) => state.auth);

    return user && accessToken ? <Outlet /> : <Navigate to={RoutePath.login} />;
};

export const GuestMiddleware = () => {
    const { user, accessToken } = useAppSelector((state) => state.auth);
    const { currentStore } = useAppSelector((state) => state.store);

    return !user && !accessToken ? (
        <Outlet />
    ) : currentStore ? (
        <Navigate to={RoutePath.dashboard} />
    ) : (
        <Navigate to={RoutePath.storeOnboard} />
    );
};
