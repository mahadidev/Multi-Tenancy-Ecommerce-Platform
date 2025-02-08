import { StoreType } from '@type/storeType';
import { WidgetType } from '@type/widgetType';
import { FC } from 'react';
import Product from "../Product/Product";

const FeaturedProductsSection: FC<{
	widget: WidgetType;
	store: StoreType;
}> = function ({ widget, store }) {
	return (
		<section className="py-12 bg-gray-100">
			<div className="container mx-auto">
				{widget.inputs.find((input) => input.name === 'title') && (
					<h1 className="w-max text-start text-2xl mb-4 text-gray-800 relative after:absolute after:w-full after:h-0.5 after:bg-gray-800 after:rounded-md after:top-full after:left-0">
						{widget.inputs.find((input) => input.name === 'title')?.value}
					</h1>
				)}

				{store.featuredProducts && (
					<div className="grid grid-cols-4 gap-5">
						{store.featuredProducts.map((product) => (
							<Product {...product} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};
export default FeaturedProductsSection;
