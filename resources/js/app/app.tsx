import { Layout } from "@/frontend/src/components";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./src/pages";

export const PATH_PREFIX = "/login";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={`${PATH_PREFIX}`} element={<Layout />}>
                        <Route
                            path={`${PATH_PREFIX}`}
                            element={<LoginPage />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
