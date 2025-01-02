import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div id="page">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
