import { SelectSubscriptionPage } from "@seller/pages";
import { useAppSelector } from "@seller/store/store";
import { Outlet } from "react-router-dom";

const SubscriptionMiddleware = () => {
    const { user, accessToken } = useAppSelector((state) => state.auth);
    const { store } = useAppSelector((state) => state.store);

    if (!user || !accessToken) {
        // If not logged in, render child routes (if any)
        return <Outlet />;
    }

    if (store?.store_subscription_status !== "Active") {
        // If subscription is not active, redirect to subscription selection
        return <SelectSubscriptionPage />;
    }

    // If logged in and subscription is active, allow access
    return <Outlet />;
};

export default SubscriptionMiddleware;
