import {
    ThemeLayoutPropsType,
    ThemeType,
    ThemeWidgetPropsType,
} from '@type/themeType';
import Layout from './layouts/Layout';
import Widget from './widgets/Widget';

// import widget json
import HeroJson from "./widgets/hero/Hero.json";


export const Simfy = {
	name: 'Simfy',
	widget: (props: ThemeWidgetPropsType) => <Widget {...props} />,
	layout: (props: ThemeLayoutPropsType) => <Layout {...props} />,
};

export const SimfySeeder: ThemeType | any = {
	id: 1,
	name: Simfy.name,
	slug: Simfy.name.toLowerCase().replaceAll(' ', '-'),
	thumbnail: null,
	widgets: [],
	pages: [
		{
			id: 0,
			name: 'home',
            label: "Home",
			slug: '/',
			title: 'Home Page',
			is_active: 1,
			type: 'home',
            thumbnail: null,
			widgets: [HeroJson],
		},
	],
};
