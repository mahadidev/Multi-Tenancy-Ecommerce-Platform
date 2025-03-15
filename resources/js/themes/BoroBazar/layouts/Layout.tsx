import { ThemeLayoutPropsType } from "@type/themeType";
import React, { FC } from "react";
import AppLayout from "./appLayout/AppLayout";
import AuthLayout from "./authLayout/AuthLayout";

const Layout: FC<ThemeLayoutPropsType> = (props) => {
    const layouts: {
        [Key: string]: React.ReactNode;
    } = {
        appLayout: <AppLayout {...props} />,
        authLayout: <AuthLayout {...props} />,
    };

    return (
        <>
            {layouts[props.layout.name] ?? (
                <h1>{props.layout.name} Layout not found</h1>
            )}
        </>
    );
};
export default Layout;
