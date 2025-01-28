import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
    BrandsPage,
    CategoriesPage,
    DashboardPage,
    LoginPage,
    PageEditPage,
    PagesPage,
    ProductEditPage,
    ProductsPage,
    ProfileSettingsPage,
    RegisterPage,
    SettingsPage,
    StoreOnboardPage,
    ThemesPage,
} from ".";
import { AuthLayout, DashboardLayout, EditorLayout } from "../components";
import DashboardMiddleware from "../middleware/dashboardMiddleware";
import GuestMiddleware from "../middleware/guestMiddleware";
import OnboardMiddleware from "../middleware/onboardMiddleware";

// routes
export const PagesRoute: FC = function () {
    return (
        <>
            <BrowserRouter basename="/seller">
                <Routes>
                    <Route path="/" element={<DashboardMiddleware />}>
                        <Route path="/" element={<DashboardLayout />}>
                            {/* Dashboard Pages */}
                            <Route path="/" element={<DashboardPage />} />

                            {/* Store Pages */}
                            <Route path="pages" element={<PagesPage />} />

                            {/* Products Pages */}
                            <Route path="products" element={<ProductsPage />} />
                            <Route
                                path="products/:id"
                                element={<ProductEditPage />}
                            />

                            {/* Categories Pages */}
                            <Route
                                path="categories"
                                element={<CategoriesPage />}
                            />

                            {/* Brands Pages */}
                            <Route path="brands" element={<BrandsPage />} />

                            {/* Settings Pages */}
                            <Route path="settings" element={<SettingsPage />} />

                            {/* Themes Pages */}
                            <Route path="themes" element={<ThemesPage />} />

                            {/* Seller account pages */}
                            <Route
                                path="my-account/profile-settings"
                                element={<ProfileSettingsPage />}
                            />
                        </Route>

                        {/* Editor Layout */}
                        <Route path="/" element={<EditorLayout />}>
                            {/* Page Edit */}
                            <Route
                                path="pages/:id"
                                element={<PageEditPage />}
                            />
                        </Route>
                    </Route>

                    <Route path="/" element={<OnboardMiddleware />}>
                        <Route path="onboard" element={<AuthLayout />}>
                            <Route
                                path="store"
                                element={<StoreOnboardPage />}
                            />
                        </Route>
                    </Route>

                    {/* Guest Middleware */}
                    <Route path="/" element={<GuestMiddleware />}>
                        <Route path="/" element={<AuthLayout />}>
                            <Route path="login" element={<LoginPage />} />
                            <Route path="register" element={<RegisterPage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};
