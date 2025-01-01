import { Layout } from "@/frontend/src/components";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./src/pages";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
