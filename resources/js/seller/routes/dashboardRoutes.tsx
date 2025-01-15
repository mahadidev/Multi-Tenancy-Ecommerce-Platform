import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../components";
import DashboardPage from "../pages/dashboard/page";
import PricingPage from "../pages/landing/pricing/page";
import PageEditPage from "../pages/pages/edit/page";
import PagesPage from "../pages/pages/page";
import SettingPage from "../pages/settings/page";
import ThemePage from "../pages/themes/page";
import { SellerDashboardMiddleware } from "../protectedRoutes";

export default function DashboardRoutes() {
    return (
        <Routes>
            <Route path="/" element={<SellerDashboardMiddleware />}>
                <Route path="*" element={<DashboardLayout />}>
                    {/* Dashboard pages start */}
                    <Route index element={<DashboardPage />} />
                    <Route path="themes" element={<ThemePage />} />
                    <Route path="settings" element={<SettingPage />} />
                    <Route path="pricing" element={<PricingPage />} />
                    <Route path="pages" element={<PagesPage />} />
                    <Route path="pages/:id" element={<PageEditPage />} />
                    {/* Dashboard pages end */}
                </Route>

                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Route>
        </Routes>
    );
}
