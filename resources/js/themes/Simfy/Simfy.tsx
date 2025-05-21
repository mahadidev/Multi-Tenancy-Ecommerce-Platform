import {
    ThemeLayoutPropsType,
    ThemeType,
    ThemeWidgetPropsType,
} from "@type/themeType";
import Layout from "./layouts/Layout";
import Widget from "./widgets/Widget";

// import layout json
import AppLayoutJson from "./layouts/appLayout/AppLayout.json";
import FooterJson from "./layouts/footer/Footer.json";
import NavigationJson from "./layouts/navigation/Navigation.json";

// import widget json
import { RegisteredThemeType } from "@themes/registeredTheme";
import HeroJson from "./widgets/hero/Hero.json";
import LoginFormjson from './widgets/loginForm/LoginForm.json';

export const Simfy: RegisteredThemeType = {
    name: "Simfy",
    widget: (props: ThemeWidgetPropsType) => <Widget {...props} />,
    layout: (props: ThemeLayoutPropsType) => <Layout {...props} />,
};

export const SimfySeeder: ThemeType | any = {
	id: 1,
	name: Simfy.name,
	slug: Simfy.name.toLowerCase().replaceAll(' ', '-'),
	thumbnail: null,
	widgets: [AppLayoutJson, NavigationJson, FooterJson],
	pages: [
		{
			id: 1,
			name: 'home',
			label: 'Home',
			slug: '/',
			title: 'Home Page',
			layout: AppLayoutJson,
			is_active: 1,
			type: 'home',
			thumbnail: null,
			widgets: [HeroJson],
		},
		{
			id: 2,
			name: 'login',
			label: 'Login',
			slug: '/login',
			title: 'Login Page',
			layout: AppLayoutJson,
			is_active: 1,
			type: 'login',
			thumbnail: null,
			widgets: [LoginFormjson],
		},
	],
};
