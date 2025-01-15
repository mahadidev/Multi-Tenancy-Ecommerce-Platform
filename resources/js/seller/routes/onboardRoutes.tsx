import { Outlet, Route, Routes } from "react-router-dom";
import { AuthLayout } from "../components";
import StoreOnboardPage from "../pages/onboard/store/page";

export default function OnboardRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                {/* Store create pages start */}
                <Route path="store" element={<Outlet />}>
                    <Route index element={<StoreOnboardPage />} />
                </Route>
                {/* Store create pages end */}
            </Route>
        </Routes>
    );
}
