import { AppLayout, AuthLayout } from "@/seller-old/src/components";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DashboardPage, LoginPage } from "./src/pages";

export const PATH_PREFIX = "/seller";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path={`${PATH_PREFIX}/login`}
                        element={<AuthLayout />}
                    >
                        <Route
                            path={`${PATH_PREFIX}/login`}
                            element={<LoginPage />}
                        />
                    </Route>
                    <Route path={`${PATH_PREFIX}`} element={<AppLayout />}>
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
