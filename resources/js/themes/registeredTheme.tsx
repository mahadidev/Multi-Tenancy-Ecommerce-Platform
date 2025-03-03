import { ThemeLayoutPropsType, ThemeWidgetPropsType } from "@type/themeType";
import { RapidShopper } from "./RapidShopper/RapidShopper";
import { Simfy } from "./Simfy/Simfy";

export interface RegisteredThemeType {
    name: string;
    widget: (props: ThemeWidgetPropsType) => React.ReactNode;
    layout: (props: ThemeLayoutPropsType) => React.ReactNode;
}

export const registeredTheme: {
    [Key: string]: RegisteredThemeType;
} = {
    Simfy: Simfy,
    RapidShopper: RapidShopper,
    // register new theme
};
