import { StoreType } from '@type/storeType';
import { ThemeHooksType } from '@type/themeHooksType';
import { WidgetType } from '@type/widgetType';
import { FC, useEffect } from 'react';
import FeaturedProductsSection from './FeaturedProductsSection/FeaturedProductsSection';
import HeroSection from './HeroSection/HeroSection';
import LoginForm from './LoginForm/LoginForm';
import AppNavigation from './Navigations/AppNavigation/Navigation';
import OffersSection from './OffersSection/OffersSection';
import ProfileCard from './ProfileCard.tsx/ProfileCard';
import SingupForm from './SingupForm/SingupForm';


export const Component: FC<{
	widget: WidgetType;
	store: StoreType;
    hooks?: ThemeHooksType
}> = function (props) {
	const components: any = {
		navigation: <AppNavigation {...props} />,
		hero: <HeroSection {...props} />,
		offers: <OffersSection {...props} />,
		featuredProducts: <FeaturedProductsSection {...props} />,
		loginForm: <LoginForm {...props} />,
		singupForm: <SingupForm {...props} />,
		profileCard: <ProfileCard {...props} />,
	};

	useEffect(() => {
		// Set CSS variables dynamically
		document.documentElement.style.setProperty(
			'--primary-color',
			props.store.primary_color
		);
		document.documentElement.style.setProperty(
			'--secondary-color',
			props.store.secondary_color
		);
	}, [props.store]);

	return (
		<>
			{components[props.widget.name]
				? components[props.widget.name]
				: `Please create the ${props.widget.name} component in react.`}
		</>
	);
};
