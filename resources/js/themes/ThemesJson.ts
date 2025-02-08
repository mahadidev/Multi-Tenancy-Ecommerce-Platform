import FeaturedProductsSection from './sources/Dokan/components/FeaturedProductsSection/FeaturedProductsSection.json';
import HeroSection from './sources/Dokan/components/HeroSection/HeroSection.json';
import LoginForm from './sources/Dokan/components/LoginForm/LoginForm.json';
import Navigation from './sources/Dokan/components/Navigations/AppNavigation/Navigation.json';
import OffersSection from './sources/Dokan/components/OffersSection/OffersSection.json';
import SingupForm from './sources/Dokan/components/SingupForm/SingupForm.json';

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
		thumbnail: 'public/themes/dokan-thumbnail.jpg',
		pages: [
			{
				name: 'home',
				title: 'Home Page',
				label: 'Home Page',
				thumbnail: '',
				slug: '/',
				type: 1,
				widgets: [
					Navigation,
					HeroSection,
					OffersSection,
					FeaturedProductsSection,
				],
			},
			{
				name: 'login',
				title: 'Login Page',
				label: 'Login Page',
				thumbnail: '',
				slug: '/singin',
				type: 5,
				widgets: [Navigation, LoginForm],
			},
			{
				name: 'singup',
				title: 'Sing Up Page',
				label: 'Sing Up Page',
				thumbnail: '',
				slug: '/singup',
				type: 6,
				widgets: [Navigation, SingupForm],
			},
		],
	},
];
