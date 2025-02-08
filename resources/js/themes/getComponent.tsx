import { StoreType } from "@type/storeType";
import { ThemeHooksType } from "@type/themeHooksType";
import { ThemeType } from "@type/themeType";
import { WidgetType } from "@type/widgetType";
import { FC } from "react";
import { Component as DokanComponent } from './sources/Dokan/components';

const ThemeComponent:FC<{
    theme: ThemeType,
    store: StoreType,
    widget: WidgetType,
    hooks?: ThemeHooksType
}> = ({theme, widget, store, hooks}) => {

    const themeComponentList: any = {
			dokan: <DokanComponent widget={widget} store={store} hooks={hooks} />,
		};

  return <>{themeComponentList[theme.slug]}</>;
}
export default ThemeComponent
