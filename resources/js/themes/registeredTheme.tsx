import { ThemeLayoutPropsType, ThemeWidgetPropsType } from "@type/themeType";
import { Avasta } from "./Avasta/Avasta";
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
	// register new theme
    Avasta: Avasta
};
