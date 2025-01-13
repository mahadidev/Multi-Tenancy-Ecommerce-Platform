import { Flowbite } from "flowbite-react";
import { Outlet } from "react-router-dom";
import { LandingFooter } from "./landingFooter";
import { LandingNavbar } from "./landingNavbar";
import { customTheme } from "./theme";

export default function LandingLayout() {
    return (
        <Flowbite theme={{ theme: customTheme }}>
            <LandingNavbar />
            <Outlet />
            <LandingFooter />
        </Flowbite>
    );
}
