import { AuthLayout, DashboardLayout } from "@/seller/components";
import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/authentication/singIn";
import SignUpPage from "./pages/authentication/singup";
import DashboardPage from "./pages/dashboard/page";
import EcommerceProductsPage from "./pages/e-commerce/products/page";
import StoreCreatePage from "./pages/store/create/page";

export const PATH_PREFIX = "/seller";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={PATH_PREFIX} element={<Outlet />}>
                        <Route path="" element={<DashboardLayout />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="e-commerce" element={<Outlet />}>
                                <Route
                                    path="products"
                                    element={<EcommerceProductsPage />}
                                />
                            </Route>
                        </Route>
                        <Route path="store-create" element={<AuthLayout />}>
                            <Route index element={<StoreCreatePage />} />
                        </Route>
                        <Route path="sing-in" element={<AuthLayout />}>
                            <Route index element={<SignInPage />} />
                        </Route>
                        <Route path="sing-up" element={<AuthLayout />}>
                            <Route index element={<SignUpPage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
