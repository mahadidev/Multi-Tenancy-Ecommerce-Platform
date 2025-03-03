import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";

export const Component: FC<ThemeWidgetPropsType> = (props) => {
    return <div>RapidShopperComponent {props.widget.label}</div>;
};
