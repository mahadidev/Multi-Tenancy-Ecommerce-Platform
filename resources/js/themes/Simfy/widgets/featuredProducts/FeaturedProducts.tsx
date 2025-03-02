import { ThemeWidgetPropsType } from '@type/themeType';
import { FC } from 'react';

const FeaturedProducts: FC<ThemeWidgetPropsType> = ({ store }) => {
	return (
		<div>


			<h1>
				Product
				{JSON.stringify(store.featuredProducts)}
			</h1>
		</div>
	);
};
export default FeaturedProducts;
