import { Flowbite } from "flowbite-react";
import React from "react";
import { customTheme } from "./theme";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
        </>
    );
};

export default BaseLayout;
