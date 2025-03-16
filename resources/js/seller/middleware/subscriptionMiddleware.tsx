import { RoutePath } from "@seller/seller_env";
import { useAppSelector } from "@seller/store/store";
import { Navigate, Outlet } from "react-router-dom";

const SubscriptionMiddleware = () => {
    const { user, accessToken } = useAppSelector((state) => state.auth);
    const { store } = useAppSelector((state) => state.store);
    console.log("heloo");
    return (
        <>
            {user && accessToken ? (
                <>
                    {/* if logged */}
                    {store?.store_subscription_status === "Expired" ? (
                        <Navigate to={RoutePath.SubscriptionPage.index()} />
                    ) : (
                        <Navigate to={RoutePath.DashboardPage.index()} />
                    )}
                </>
            ) : (
                <Outlet />
            )}
        </>
    );
};
export default SubscriptionMiddleware;
