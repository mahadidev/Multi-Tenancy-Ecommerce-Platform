import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
    BlogCategories,
    BlogCreatePage,
    BlogEditPage,
    BlogsPage,
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
import ForgotPassword from "./AuthPage/ForgotPassword";
import ForgotPasswordSuccess from "./AuthPage/ForgotPasswordSuccess";
import ResetPassword from "./AuthPage/ResetPassword";
import CustomersPage from "./CustomersPage/CustomersPage";
import NotificationsPage from "./NotificationsPage/NotificationsPage";
import CreateOrderPage from "./OrdersPage/CreateOrder/CreateOrderPage";
import OrdersPage from "./OrdersPage/OrdersPage";

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

                            {/* Orders Pages */}
                            <Route path="/orders" element={<OrdersPage />} />

                            {/* Orders Pages */}
                            <Route
                                path="/customers"
                                element={<CustomersPage />}
                            />

                            {/* Ocreate orders Pages */}
                            <Route
                                path="/orders/create"
                                element={<CreateOrderPage />}
                            />

                            {/* Store Pages */}
                            <Route path="pages" element={<PagesPage />} />

                            {/* Products Pages */}
                            <Route path="products" element={<ProductsPage />} />
                            <Route
                                path="products/:id"
                                element={<ProductEditPage />}
                            />

                            {/* Blogs Pages */}
                            <Route path="blogs" element={<BlogsPage />} />
                            <Route
                                path="blogs/categories"
                                element={<BlogCategories />}
                            />
                            <Route
                                path="blogs/create"
                                element={<BlogCreatePage />}
                            />
                            <Route
                                path="blogs/:id"
                                element={<BlogEditPage />}
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

                            {/* Notifications page */}
                            <Route
                                path="notifications"
                                element={<NotificationsPage />}
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
                            <Route
                                path="forgot-password"
                                element={<ForgotPassword />}
                            />
                            <Route
                                path="forgot-password-success"
                                element={<ForgotPasswordSuccess />}
                            />
                            <Route
                                path="reset-password"
                                element={<ResetPassword />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};
