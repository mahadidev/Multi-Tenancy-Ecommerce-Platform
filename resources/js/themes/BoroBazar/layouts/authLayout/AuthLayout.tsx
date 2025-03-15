import { ThemeLayoutPropsType } from "@type/themeType";
import { FC } from "react";

const AuthLayout: FC<ThemeLayoutPropsType> = (props) => {
    return <main>{props.children && props.children}</main>;
};
export default AuthLayout;
