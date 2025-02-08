import { StoreType } from '@type/storeType';
import { WidgetType } from '@type/widgetType';
import { FC, useEffect } from 'react';
import FeaturedProductsSection from './FeaturedProductsSection/FeaturedProductsSection';
import HeroSection from './HeroSection/HeroSection';
import LoginForm from './LoginForm/LoginForm';
import AppNavigation from './Navigations/AppNavigation/Navigation';
import OffersSection from './OffersSection/OffersSection';


export const Component: FC<{
	widget: WidgetType;
	store: StoreType;
}> = function ({ widget, store }) {
	const components: any = {
		navigation: <AppNavigation widget={widget} store={store} />,
		hero: <HeroSection widget={widget} store={store} />,
		offers: <OffersSection widget={widget} store={store} />,
		featuredProducts: <FeaturedProductsSection widget={widget} store={store} />,
		loginForm: <LoginForm widget={widget} store={store} />,
	};

	useEffect(() => {
		// Set CSS variables dynamically
        document.documentElement.style.setProperty(
            '--primary-color',
            store.primary_color
        );
        document.documentElement.style.setProperty(
            '--secondary-color',
            store.secondary_color
        );
	}, [store]);

	return (
		<>
			{components[widget.name]
				? components[widget.name]
				: `Please create the ${widget.name} component in react.`}
		</>
	);
};
