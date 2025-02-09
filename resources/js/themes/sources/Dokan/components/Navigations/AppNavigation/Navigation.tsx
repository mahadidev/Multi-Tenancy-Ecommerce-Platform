import { ThemeComponentPropsType } from "@type/themeComponentType";
import { FC } from "react";
import AppNavigationMenubar from "./AppNavigationMenubar";
import AppNavigationNavbar from "./AppNavigationNavbar";


const AppNavigation: FC<ThemeComponentPropsType> = function (props) {
	return (
		<>
			<AppNavigationNavbar {...props} />
			<AppNavigationMenubar {...props} />
		</>
	);
};
export default AppNavigation
