import { ThemeLayoutPropsType, ThemeWidgetPropsType } from "@type/themeType";
import { KachaBazar } from "./KachaBazar/KachaBazar";
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
    KachaBazar: KachaBazar,
    RapidShopper: RapidShopper,
    // register new theme
};
