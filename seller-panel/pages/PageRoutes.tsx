import { AuthLayout, DashboardLayout } from '@seller-panel/components';
import DashboardMiddleware from '@seller-panel/middleware/dashboardMiddleware';
import GuestMiddleware from '@seller-panel/middleware/guestMiddleware';
import OnboardMiddleware from '@seller-panel/middleware/onboardMiddleware';
import {
    BrandsPage,
    CategoriesPage,
    DashboardPage,
    LoginPage,
    ProductEditPage,
    ProductsPage,
    RegisterPage,
    SettingsPage,
    StoreOnboardPage,
    StorePagesEditPage,
    StorePagesPage
} from '@seller-panel/pages';
import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
							<Route path="pages" element={<StorePagesPage />} />
							<Route path="pages/:id" element={<StorePagesEditPage />} />

							{/* Products Pages */}
							<Route path="products" element={<ProductsPage />} />
							<Route path="products/:id" element={<ProductEditPage />} />

							{/* Categories Pages */}
							<Route path="categories" element={<CategoriesPage />} />

							{/* Brands Pages */}
							<Route path="brands" element={<BrandsPage />} />

							{/* Settings Pages */}
							<Route path="settings" element={<SettingsPage />} />
						</Route>
					</Route>

					<Route path="/" element={<OnboardMiddleware />}>
						<Route path="onboard" element={<AuthLayout />}>
							<Route path="store" element={<StoreOnboardPage />} />
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
