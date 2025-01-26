import { CategoryType } from '@/types/categoryType';
import { WidgetType } from '@type/widgetType';
import { FC } from 'react';

export const Component: FC<
	WidgetType & {
		categories?: CategoryType[];
	}
> = function (widget) {
	const components: any = {
		navigation: 'navigation',
		hero: 'Hero',
		offers: 'offers',
		promoGrid: 'promo',
	};

	return (
		<>
			{components[widget.name]
				? components[widget.name]
				: `Please create the ${widget.name} component in react.`}
		</>
	);
};
