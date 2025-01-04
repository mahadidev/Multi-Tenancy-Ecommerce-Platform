import { Outlet } from "react-router-dom";
import Navigation from "./navigation";

const Layout = () => {
    return (
        <div id="page">
            <Navigation />

            <Outlet />
            <div className="h-96"></div>
            <div className="h-96"></div>
        </div>
    );
};

export default Layout;
