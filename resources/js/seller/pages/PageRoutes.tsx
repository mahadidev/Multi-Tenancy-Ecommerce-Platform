import SubscriptionLayout from "@seller/components/Layout/SubscriptionLayout";
import SubscriptionMiddleware from "@seller/middleware/subscriptionMiddleware";
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
import AccessManagementPage from "./AccessManagement/AccessManagement";
import EmailVerificationPage from "./AuthPage/EmailVerificationPage";
import ForgotPassword from "./AuthPage/ForgotPassword";
import ForgotPasswordSuccess from "./AuthPage/ForgotPasswordSuccess";
import ResetPassword from "./AuthPage/ResetPassword";
import SocialMediaPage from "./AuthPage/SocialMediaPage";
import CustomersPage from "./CustomersPage/CustomersPage";
import MenusPage from "./MenusPage/MenusPage";
import NotificationsPage from "./NotificationsPage/NotificationsPage";
import CreateOrderPage from "./OrdersPage/CreateOrder/CreateOrderPage";
import OrdersPage from "./OrdersPage/OrdersPage";
import SelectSubscriptionPage from "./SelectSubscription/SelectSubscriptionPage";
import SubscriptionFailedPage from "./SelectSubscription/SubscriptionFailedPage";
import SubscriptionSuccessPage from "./SelectSubscription/SubscriptionSuccessPage";
import StoreAdminPage from "./StoreAdminPage/StoreAdminPage";
import CreateStorePage from "./StoresPage/CreateStorePage";
import StoresPage from "./StoresPage/StoresPage";
import SubscriptionCancelledPage from "./SelectSubscription/SubscriptionCancelledPage";

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
                            {/* Access Management Pages */}
                            <Route
                                path="access-management"
                                element={<AccessManagementPage />}
                            />
                            {/* Store Admin Pages */}
                            <Route
                                path="store-admin"
                                element={<StoreAdminPage />}
                            />
                            {/* Themes Pages */}
                            <Route path="themes" element={<ThemesPage />} />
                            {/* Menus page */}
                            <Route path="menus" element={<MenusPage />} />
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
                            {/* Stores page */}
                            <Route path="stores" element={<StoresPage />} />
                            <Route
                                path="stores/create"
                                element={<CreateStorePage />}
                            />{" "}
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
                                path="verify-email"
                                element={<EmailVerificationPage />}
                            />
                            <Route
                                path="social-media"
                                element={<SocialMediaPage />}
                            />
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
                            />{" "}
                        </Route>
                    </Route>

                    <Route path="/" element={<SubscriptionMiddleware />}>
                        <Route path="/" element={<SubscriptionLayout />}>
                            <Route
                                path="select-subscriptions"
                                element={<SelectSubscriptionPage />}
                            />
                            <Route
                                path="subscription-success"
                                element={<SubscriptionSuccessPage />}
                            />
                            <Route
                                path="subscription-failed"
                                element={<SubscriptionFailedPage />}
                            />
                            <Route
                                path="subscription-cancelled"
                                element={<SubscriptionCancelledPage />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};
