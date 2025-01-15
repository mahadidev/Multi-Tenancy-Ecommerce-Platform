import { Outlet } from "react-router-dom";
import BaseLayout from "../index";

export default function AuthLayout() {
    return (
        <BaseLayout>
            <Outlet />
        </BaseLayout>
    );
}
