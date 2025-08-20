import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Layouts, middleware, and pages — import as before
import SubscriptionLayout from '@seller/components/Layout/SubscriptionLayout';
import SubscriptionMiddleware from '@seller/middleware/subscriptionMiddleware';
import {
    BlogCategories,
    BlogCreatePage,
    BlogEditPage,
    BlogsPage,
    BrandsPage,
    CategoriesPage,
    // DashboardPage,
    DashboardPageV2,
    ExpensePage,
    VendorsPage,
    LoginPage,
    OrderPlacerPage,
    PageEditPage,
    PagesPage,
    ProductEditPage,
    ProductsPage,
    ProfileSettingsPage,
    RegisterPage,
    SettingsPage,
    StoreOnboardPage,
    ThemesPage,
} from '.';
import StockReportPage from './StockReportPage/StockReportPage';
import {
    AuthLayout,
    DashboardLayout,
    EditorLayout,
    OrderPlacerLayout,
} from '../components';
import DashboardMiddleware from '../middleware/dashboardMiddleware';
import GuestMiddleware from '../middleware/guestMiddleware';
import OnboardMiddleware from '../middleware/onboardMiddleware';
import AccessManagementPage from './AccessManagement/AccessManagement';
import EmailVerificationPage from './AuthPage/EmailVerificationPage';
import ForgotPassword from './AuthPage/ForgotPassword';
import ForgotPasswordSuccess from './AuthPage/ForgotPasswordSuccess';
import ResetPassword from './AuthPage/ResetPassword';
import SocialMediaPage from './AuthPage/SocialMediaPage';
import CustomersPage from './CustomersPage/CustomersPage';
import MenusPage from './MenusPage/MenusPage';
import NotificationsPage from './NotificationsPage/NotificationsPage';
import OrdersPage from './OrdersPage/OrdersPage';
import SelectSubscriptionPage from './SelectSubscription/SelectSubscriptionPage';
import SubscriptionCancelledPage from './SelectSubscription/SubscriptionCancelledPage';
import SubscriptionFailedPage from './SelectSubscription/SubscriptionFailedPage';
import SubscriptionSuccessPage from './SelectSubscription/SubscriptionSuccessPage';
import ShipmentOrdersPage from './ShipmentPage/OrdersShipmentPage';
import StoreAdminPage from './StoreAdminPage/StoreAdminPage';
import CreateStorePage from './StoresPage/CreateStorePage';
import StoresPage from './StoresPage/StoresPage';

export const PagesRoute: FC = function () {
	return (
		<BrowserRouter basename="/seller">
			<Routes>
				{/* 👇 Redirect /public/seller/* to /seller/* */}
				<Route
					path="/public/seller/*"
					element={
						<Navigate
							to={window.location.pathname.replace('/public', '')}
							replace
						/>
					}
				/>

				{/* Authenticated Routes */}
				<Route path="/" element={<DashboardMiddleware />}>
					<Route path="/" element={<DashboardLayout />}>
						<Route path="/" element={<DashboardPageV2 />} />
						{/* <Route path="/" element={<DashboardPage />} /> */}
						<Route path="/orders" element={<OrdersPage />} />
						<Route path="/shipment-orders" element={<ShipmentOrdersPage />} />
						<Route path="/customers" element={<CustomersPage />} />
						<Route path="pages" element={<PagesPage />} />
						<Route path="products" element={<ProductsPage />} />
						<Route path="products/:id" element={<ProductEditPage />} />
						<Route path="blogs" element={<BlogsPage />} />
						<Route path="blogs/categories" element={<BlogCategories />} />
						<Route path="blogs/create" element={<BlogCreatePage />} />
						<Route path="blogs/:id" element={<BlogEditPage />} />
						<Route path="categories" element={<CategoriesPage />} />
						<Route path="brands" element={<BrandsPage />} />
						<Route path="expenses" element={<ExpensePage />} />
						<Route path="vendors" element={<VendorsPage />} />
						<Route path="settings" element={<SettingsPage />} />
						<Route
							path="access-management"
							element={<AccessManagementPage />}
						/>
						<Route path="store-admin" element={<StoreAdminPage />} />
						<Route path="themes" element={<ThemesPage />} />
						<Route path="menus" element={<MenusPage />} />
						<Route
							path="my-account/profile-settings"
							element={<ProfileSettingsPage />}
						/>
						<Route path="notifications" element={<NotificationsPage />} />
						<Route path="stores" element={<StoresPage />} />
						<Route path="stores/create" element={<CreateStorePage />} />
						<Route path="stock-report" element={<StockReportPage />} />
					</Route>

					{/* Order Placer */}
					<Route path="/" element={<OrderPlacerLayout />}>
						<Route path="/order-placer" element={<OrderPlacerPage />} />
					</Route>

					{/* Editor Layout */}
					<Route path="/" element={<EditorLayout />}>
						<Route path="pages/:id" element={<PageEditPage />} />
					</Route>
				</Route>

				{/* Onboarding */}
				<Route path="/" element={<OnboardMiddleware />}>
					<Route path="onboard" element={<AuthLayout />}>
						<Route path="store" element={<StoreOnboardPage />} />
					</Route>
				</Route>

				{/* Guest */}
				<Route path="/" element={<GuestMiddleware />}>
					<Route path="/" element={<AuthLayout />}>
						<Route path="login" element={<LoginPage />} />
						<Route path="register" element={<RegisterPage />} />
						<Route path="verify-email" element={<EmailVerificationPage />} />
						<Route path="social-media" element={<SocialMediaPage />} />
						<Route path="forgot-password" element={<ForgotPassword />} />
						<Route
							path="forgot-password-success"
							element={<ForgotPasswordSuccess />}
						/>
						<Route path="reset-password" element={<ResetPassword />} />
					</Route>
				</Route>

				{/* Subscription */}
				<Route path="/" element={<SubscriptionMiddleware />}>
					<Route path="/" element={<SubscriptionLayout />}>
						<Route
							path="/select-subscriptions"
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
	);
};
