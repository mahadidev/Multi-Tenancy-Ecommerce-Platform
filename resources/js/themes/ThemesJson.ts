import HeroSection from './sources/Dokan/components/HeroSection/HeroSection.json';
import Navigation from './sources/Dokan/components/Navigations/AppNavigation/Navigation.json';
import OffersSection from './sources/Dokan/components/OffersSection/OffersSection.json';

export const ThemesJson: {
	name: string;
	slug: string;
	thumbnail: string;
	pages: {
		name: string;
		title: string;
		label: string;
		thumbnail: string;
		slug: string;
		type: number;
		widgets: any[];
	}[];
}[] = [
	{
		name: 'Dokan',
		slug: 'dokan',
		thumbnail: '',
		pages: [
			{
				name: 'home',
				title: 'Home Page',
				label: 'Home Page',
				thumbnail: '',
				slug: '/',
				type: 1,
				widgets: [Navigation, HeroSection, OffersSection],
			},
		],
	},
];
