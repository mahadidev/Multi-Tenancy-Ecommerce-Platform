import { AuthLayout, DashboardLayout } from "@/seller/components";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/authentication/singIn";
import SignUpPage from "./pages/authentication/singup";
import DashboardPage from "./pages/dashboard/page";
import EcommerceProductsPage from "./pages/e-commerce/products/page";
import StoreCreatePage from "./pages/store/create/page";
import {
    GuestMiddleware,
    SellerDashboardMiddleware,
    StoreCreateMiddleware,
} from "./protectedRoutes";

const App = () => {
    return (
        <>
            <BrowserRouter basename={"/seller"}>
                <Routes>
                    <Route path="/" element={<SellerDashboardMiddleware />}>
                        <Route path="/" element={<DashboardLayout />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="e-commerce" element={<Outlet />}>
                                <Route
                                    path="products"
                                    element={<EcommerceProductsPage />}
                                />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="/" element={<StoreCreateMiddleware />}>
                        <Route path="store" element={<AuthLayout />}>
                            <Route
                                path="create"
                                element={<StoreCreatePage />}
                            />
                        </Route>
                    </Route>
                    <Route path="/" element={<GuestMiddleware />}>
                        <Route path="login" element={<AuthLayout />}>
                            <Route index element={<SignInPage />} />
                        </Route>
                        <Route path="register" element={<AuthLayout />}>
                            <Route index element={<SignUpPage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
