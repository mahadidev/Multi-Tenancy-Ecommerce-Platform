import { AuthLayout, DashboardLayout } from "@/seller/components";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/authentication/singIn";
import SignUpPage from "./pages/authentication/singup";
import DashboardPage from "./pages/dashboard/dashboard";
export const PATH_PREFIX = "/seller";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path={`${PATH_PREFIX}/sign-in`}
                        element={<AuthLayout />}
                    >
                        <Route
                            path={`${PATH_PREFIX}/sign-in`}
                            element={<SignInPage />}
                        />
                    </Route>
                    <Route
                        path={`${PATH_PREFIX}/sign-up`}
                        element={<AuthLayout />}
                    >
                        <Route
                            path={`${PATH_PREFIX}/sign-up`}
                            element={<SignUpPage />}
                        />
                    </Route>
                    <Route
                        path={`${PATH_PREFIX}`}
                        element={<DashboardLayout />}
                    >
                        <Route
                            path={`${PATH_PREFIX}/`}
                            element={<DashboardPage />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
