import { ThemeLayoutPropsType, ThemeWidgetPropsType } from "@type/themeType";

export interface RegisteredThemeType {
    name: string;
    widget: (props: ThemeWidgetPropsType) => React.ReactNode;
    layout: (props: ThemeLayoutPropsType) => React.ReactNode;
}

export const registeredTheme: {
    [Key: string]: RegisteredThemeType;
} = {
    // Add new themes here when they are created
    // Example:
    // ModernEcommerce: ModernEcommerce,
};