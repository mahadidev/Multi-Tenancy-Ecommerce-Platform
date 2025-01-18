import { Flowbite } from "flowbite-react";
import React from "react";
import ImageUploaderModal from "../imageUploader/modal";
import { customTheme } from "./theme";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Flowbite theme={{ theme: customTheme }}>
                {children}
                <ImageUploaderModal />
            </Flowbite>
        </>
    );
};

export default BaseLayout;
