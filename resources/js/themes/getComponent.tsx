import { StoreType } from "@type/storeType";
import { ThemeType } from "@type/themeType";
import { WidgetType } from "@type/widgetType";
import { FC } from "react";
import { Component as DokanComponent } from './sources/Dokan/components';

const ThemeComponent:FC<{
    theme: ThemeType,
    store: StoreType,
    widget: WidgetType
}> = ({theme, widget, store}) => {

    const themeComponentList: any = {
        "dokan": <DokanComponent widget={widget} store={store} />
    }

  return <>{themeComponentList[theme.slug]}</>;
}
export default ThemeComponent
