import { StoreType } from '@type/storeType';
import { WidgetType } from '@type/widgetType';
import { FC } from 'react';
import HeroSection from './HeroSection/HeroSection';
import AppNavigation from './Navigations/AppNavigation/Navigation';
import OffersSection from './OffersSection/OffersSection';

export const Component: FC<
	{
        widget: WidgetType,
        store: StoreType
    }
> = function ({widget, store}) {
	const components: any = {
		navigation: <AppNavigation widget={widget} store={store} />,
		hero: <HeroSection widget={widget} store={store} />,
		offers: <OffersSection widget={widget} store={store} />,
	};

	return (
		<>
			{components[widget.name]
				? components[widget.name]
				: `Please create the ${widget.name} component in react.`}
		</>
	);
};
