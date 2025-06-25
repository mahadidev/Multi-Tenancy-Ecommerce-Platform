import { Outlet } from "react-router-dom";
import Navigation from "./navigation";

const Layout = () => {
    return (
        <div id="page">
            <Navigation />
            <Outlet />
        </div>
    );
};

export default Layout;
