import { FC } from "react";
import { Outlet } from "react-router-dom";
import BaseLayout from "./BaseLayout";

type SubscriptionLayoutProps = object;

const SubscriptionLayout: FC<SubscriptionLayoutProps> = function () {
    return (
        <BaseLayout>
            <Outlet />
        </BaseLayout>
    );
};

export default SubscriptionLayout;
