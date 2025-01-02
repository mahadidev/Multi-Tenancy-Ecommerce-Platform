import type { PropsWithChildren } from "react";
import React from "react";
import { Outlet } from "react-router-dom";
import BaseLayout from "./index";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <BaseLayout>
            <Outlet />
        </BaseLayout>
    );
}
