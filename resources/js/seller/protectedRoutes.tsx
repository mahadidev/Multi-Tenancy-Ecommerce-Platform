import { Navigate, Outlet } from "react-router-dom";
import { RoutePath } from "./env";
import { useAppSelector } from "./store";

export const SellerDashboardMiddleware = () => {
    const { user, accessToken, store } = useAppSelector((state) => state.auth);

    return user && accessToken ? (
        store ? (
            <Outlet />
        ) : (
            <Navigate to={RoutePath.storeCreate} />
        )
    ) : (
        <Navigate to={RoutePath.login} />
    );
};

export const StoreCreateMiddleware = () => {
    const { user, accessToken } = useAppSelector((state) => state.auth);

    return user && accessToken ? <Outlet /> : <Navigate to={RoutePath.login} />;
};

export const GuestMiddleware = () => {
    const { user, accessToken, store } = useAppSelector((state) => state.auth);

    return !user && !accessToken ? (
        <Outlet />
    ) : store ? (
        <Navigate to={RoutePath.dashboard} />
    ) : (
        <Navigate to={RoutePath.storeCreate} />
    );
};
