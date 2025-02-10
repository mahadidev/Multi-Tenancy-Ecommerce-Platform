import { ThemeLayoutPropsType, ThemeWidgetPropsType } from "@type/themeType";
import { Simfy } from "./Simfy/Simfy";

export interface RegisterdThemeType {
	name: string;
	widget: (props: ThemeWidgetPropsType) => React.ReactNode;
	layout: (props: ThemeLayoutPropsType) => React.ReactNode;
}


export const registerdTheme: {
	[Key: string]: RegisterdThemeType;
} = {
	Simfy: Simfy,
};
