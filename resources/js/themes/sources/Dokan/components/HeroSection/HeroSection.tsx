import { StoreType } from '@type/storeType';
import { WidgetType } from '@type/widgetType';
import { FC } from 'react';
import CategoriesList from './CategoriesList';

const HeroSection: FC<{
	widget: WidgetType;
	store: StoreType;
}> = function ({ widget, store }) {
	return (
		<>
			<section className="w-full  bg-gray-100 relative">
				<div
					className="min-w-full absolute w-full h-full top-0 left-0"
					style={{
						backgroundColor: `${
							widget.inputs.slice().sort(function (inputA, inputB) {
								return inputA.id - inputB.id;
							})[0] &&
							widget.inputs
								.slice()
								.sort(function (inputA, inputB) {
									return inputA.id - inputB.id;
								})[0]
								?.items?.find((item) => item.name === 'bg-color')?.value
						}`,
					}}
				></div>
				<div className="container mx-auto relative z-10">
					<div className="grid grid-cols-6">
						<div className="w-full">
                            <CategoriesList categories={store.categories} />
                        </div>
						<div className="col-span-5 overflow-x-auto flex">
							{widget.inputs
								.slice()
								.sort(function (inputA, inputB) {
									return inputA.id - inputB.id;
								})
								.map((input, inputIndex: number) => {
									if (input.name === 'slide' && input.items) {
										return (
											<img
												key={inputIndex}
												className="min-w-full object-fill"
												src={`${
													input.items.find((item) => item.name === 'image')
														?.value
												}
                                `}
												alt="Banner"
											/>
										);
									}
								})}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default HeroSection;
