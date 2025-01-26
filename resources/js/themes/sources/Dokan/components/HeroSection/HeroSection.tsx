import { StoreType } from '@type/storeType';
import { WidgetType } from '@type/widgetType';
import { FC } from 'react';

const HeroSection: FC<{
	widget: WidgetType;
    store: StoreType
}> = function ({widget}) {
	return (
		<>
			<section className="w-full flex overflow-x-auto">
				{widget.inputs
					.slice()
					.sort(function (inputA, inputB) {
						return inputA.id - inputB.id;
					})
					.map((input, inputIndex: number) => {
						if (input.name === 'slide' && input.items) {
							return (
								<div
									className="min-w-full"
									key={inputIndex}
									style={{
										backgroundColor: `${
											input.items.find((item) => item.name === 'bg-color')
												?.value
										}`,
									}}
								>
									<div className="container mx-auto">
										<div className="grid grid-cols-6">
											<div className="w-full"></div>
											<div className="col-span-5">
												<img
													className="min-w-full object-fill"
													src={`${
														input.items.find((item) => item.name === 'image')
															?.value
													}
                                `}
													alt="Banner"
												/>
											</div>
										</div>
									</div>
								</div>
							);
						}
					})}
			</section>
		</>
	);
};

export default HeroSection;
