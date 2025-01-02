import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Navigation from "./navigation";
import Sidebar from "./sidebar";

const AppLayout = () => {
    return (
        <>
            <Navigation />
            <div className="flex overflow-hidden pt-16 bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div
                    id="main-content"
                    className="overflow-y-auto relative w-full h-full bg-gray-50 lg:ml-64 dark:bg-gray-900"
                >
                    <main>
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default AppLayout;
