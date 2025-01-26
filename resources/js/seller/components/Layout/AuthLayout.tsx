import { FC } from "react";
import { Outlet } from "react-router-dom";
import BaseLayout from "./BaseLayout";

type AuthLayoutProps = object

const AuthLayout: FC<AuthLayoutProps> = function () {
    return <BaseLayout><Outlet /></BaseLayout>;
};

export default AuthLayout;
