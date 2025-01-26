import { CategoryType } from "@/types/categoryType";
import { WidgetType } from "@type/widgetType";
import { FC } from "react";
import AppNavigationMenubar from "./AppNavigationMenubar";
import AppNavigationNavbar from "./AppNavigationNavbar";


const AppNavigation:FC<WidgetType & {
    categories?: CategoryType[]
}> = function(widget) {
    return (
		<>
			<AppNavigationNavbar />
			<AppNavigationMenubar {...widget} />
		</>
	);
}
export default AppNavigation
