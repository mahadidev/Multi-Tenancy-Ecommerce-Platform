import { RoutePath } from "@seller/seller_env";
import { useAppSelector } from "@seller/store/store";
import { Navigate, Outlet } from "react-router-dom";

const SubscriptionMiddleware = () => {
    const { user, accessToken } = useAppSelector((state) => state.auth);

    if (!user || !accessToken) {
        // If not logged in, render child routes (if any)
        return <Navigate to={RoutePath.LoginPage.index()} />;
    }

    // if (store?.store_subscription_status !== "Active") {
    //     // If subscription is not active, redirect to subscription selection
    //     return <Outlet />;
    // }

    // If logged in and subscription is active, allow access
    return <Outlet />;
};

export default SubscriptionMiddleware;
