import { WidgetType } from '@type/widgetType';
import { FC } from 'react';

const HeroSection: FC<WidgetType> = function (props) {
	return (
		<>
			<section className="flex overflow-x-auto">
				{props.inputs
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
                                            <div className='w-full'>

                                            </div>
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
