import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Import middleware
import DashboardMiddleware from './middleware/dashboardMiddleware';
import GuestMiddleware from './middleware/guestMiddleware';
import OnboardMiddleware from './middleware/onboardMiddleware';
import SubscriptionMiddleware from './middleware/subscriptionMiddleware';

// Import layouts
import { DashboardLayout } from './components';

// Import all route groups
import {
    AuthRoutes,
    ContentRoutes,
    DashboardRoutes,
    EditorRoutes,
    FinanceRoutes,
    InventoryRoutes,
    OnboardRoutes,
    SalesRoutes,
    SettingsRoutes,
    SubscriptionRoutes,
    UsersRoutes,
} from './Routes';

const App: FC = function () {
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
                    {/* Main Dashboard Layout Routes */}
                    <Route path="/" element={<DashboardLayout />}>
                        {/* Dashboard & Analytics */}
                        {DashboardRoutes}

                        {/* Inventory Management */}
                        {InventoryRoutes}

                        {/* Sales Management */}
                        {SalesRoutes}

                        {/* Finance Management */}
                        {FinanceRoutes}

                        {/* Content Management */}
                        {ContentRoutes}


                        {/* User Management */}
                        {UsersRoutes}

                        {/* Settings & Configuration */}
                        {SettingsRoutes}
                    </Route>


                    {/* Editor & Special Layouts */}
                    {EditorRoutes}
                </Route>

                {/* Onboarding Routes */}
                <Route path="/" element={<OnboardMiddleware />}>
                    {OnboardRoutes}
                </Route>

                {/* Guest/Auth Routes */}
                <Route path="/" element={<GuestMiddleware />}>
                    {AuthRoutes}
                </Route>

                {/* Subscription Routes */}
                <Route path="/" element={<SubscriptionMiddleware />}>
                    {SubscriptionRoutes}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
