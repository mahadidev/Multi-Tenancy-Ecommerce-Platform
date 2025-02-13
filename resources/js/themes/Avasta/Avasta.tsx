import { RegisteredThemeType } from '@themes/registeredTheme';
import {
    ThemeLayoutPropsType,
    ThemeType,
    ThemeWidgetPropsType,
} from '@type/themeType';
import Layout from './layouts/Layout';
import HeroJson from "./widgets/Hero/Hero.json";
import Widget from './widgets/Widget';

// theme config
export const Avasta: RegisteredThemeType = {
	name: 'Avasta',
	widget: (props: ThemeWidgetPropsType) => <Widget {...props} />,
	layout: (props: ThemeLayoutPropsType) => <Layout {...props} />,
};

// set seeder
export const AvastaSeeder: ThemeType | any = {
	name: Avasta.name,
	slug: Avasta.name.toLowerCase().replaceAll(' ', '-'),
	thumbnail: null,
	widgets: [],
	pages: [
		{
			id: 0,
			name: 'home',
			label: 'Home Page',
			slug: '/', // for home page keep it /
			title: 'Home Page',
			layout: null, // import your Layout json
			is_active: 1, // 1 is active and 0 is deactived
			type: 'home', // use your page type (home|about|contact|login|register) etc
			thumbnail: null,
			widgets: [HeroJson], // import your widgets json
		},
	],
};
