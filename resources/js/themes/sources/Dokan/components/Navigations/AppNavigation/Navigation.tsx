import { StoreType } from "@type/storeType";
import { WidgetType } from "@type/widgetType";
import { FC } from "react";
import AppNavigationMenubar from "./AppNavigationMenubar";
import AppNavigationNavbar from "./AppNavigationNavbar";


const AppNavigation: FC<{
	widget: WidgetType;
	store: StoreType;
}> = function ({ widget, store }) {
	return (
		<>
			<AppNavigationNavbar widget={widget} store={store} />
			<AppNavigationMenubar widget={widget} store={store} />
		</>
	);
};
export default AppNavigation
