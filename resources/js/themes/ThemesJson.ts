import FeaturedProductsSection from './sources/Dokan/components/FeaturedProductsSection/FeaturedProductsSection.json';
import HeroSection from './sources/Dokan/components/HeroSection/HeroSection.json';
import LoginForm from './sources/Dokan/components/LoginForm/LoginForm.json';
import Navigation from './sources/Dokan/components/Navigations/AppNavigation/Navigation.json';
import OffersSection from './sources/Dokan/components/OffersSection/OffersSection.json';
import ProfileCard from './sources/Dokan/components/ProfileCard.tsx/ProfileCard.json';
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
				title: 'Home',
				label: 'Home',
				thumbnail: '',
				slug: '/',
				type: 1, // type 1 is home page type
				widgets: [
					Navigation,
					HeroSection,
					OffersSection,
					FeaturedProductsSection,
				],
			},
			{
				name: 'login',
				title: 'Login',
				label: 'Login',
				thumbnail: '',
				slug: '/singin',
				type: 5, // type 5 is authentication page type
				widgets: [Navigation, LoginForm],
			},
			{
				name: 'singup',
				title: 'Sing Up',
				label: 'Sing Up Page',
				thumbnail: '',
				slug: '/singup',
				type: 5, // type 5 is authentication page type
				widgets: [Navigation, SingupForm],
			},
			{
				name: 'profile',
				title: 'Pofile',
				label: 'Profile',
				thumbnail: '',
				slug: '/profile',
				type: 6, // type 6 is profile page type
				widgets: [Navigation, ProfileCard],
			},
		],
	},
];
