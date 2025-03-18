import { ThemeLayoutPropsType } from "@type/themeType";
import { FC } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: FC<ThemeLayoutPropsType> = (props) => {
    return (
        <main>
            {Outlet && <Outlet />}
            {props.children && props.children}
        </main>
    );
};
export default AuthLayout;
