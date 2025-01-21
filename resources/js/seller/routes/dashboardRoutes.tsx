import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../components";
import BrandsPage from "../pages/brands/page";
import CategoriesPage from "../pages/categories/page";
import PricingPage from "../pages/landing/pricing/page";
import PageEditPage from "../pages/pages/edit/page";
import PagesPage from "../pages/pages/page";
import ProductsPage from "../pages/products/page";
import SettingPage from "../pages/settings/page";
import ThemePage from "../pages/themes/page";
import { SellerDashboardMiddleware } from "../protectedRoutes";

export default function DashboardRoutes() {
    return (
        <Routes>
            <Route path="/" element={<SellerDashboardMiddleware />}>
                <Route path="*" element={<DashboardLayout />}>
                    {/* Dashboard pages start */}
                    <Route
                        index
                        element={
                            <div className="w-full h-[40vh] flex justify-center items-center">
                                <h1 className="text-gray-700 dark:text-white text-center">
                                    Coming Soon
                                </h1>
                            </div>
                        }
                    />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="brands" element={<BrandsPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route
                        path="products/:id/edit"
                        element={<h1>Coming Soon</h1>}
                    />
                    <Route path="themes" element={<ThemePage />} />
                    <Route path="settings" element={<SettingPage />} />
                    <Route path="pricing" element={<PricingPage />} />
                    <Route path="pages" element={<PagesPage />} />
                    <Route path="pages/:id/edit" element={<PageEditPage />} />
                    {/* Dashboard pages end */}
                </Route>

                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Route>
        </Routes>
    );
}
