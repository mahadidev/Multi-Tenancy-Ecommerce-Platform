import { ThemeType } from "@/types/themeType";
import { WidgetType } from "@/types/widgetType";
import { FC } from "react";
import { Component as DokanComponent } from './sources/Dokan/components';

const ThemeComponent:FC<{
    theme: ThemeType,
    widget: WidgetType
}> = ({theme, widget}) => {

    const themeComponentList: any = {
        "simfy-commerce": <DokanComponent {...widget} />
    }

  return <>{themeComponentList[theme.slug]}</>;
}
export default ThemeComponent
