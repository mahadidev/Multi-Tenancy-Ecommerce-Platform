import { StoreType } from "@type/storeType";
import { WidgetType } from "@type/widgetType";
import { FC } from "react";

const OffersSection: FC<{
	widget: WidgetType;
	store: StoreType;
}> = function ({ widget }) {
	return (
		<>
			<section className="py-4 mt-4 bg-gray-100">
				<h1 className="text-center text-2xl mb-4 text-gray-800">
					{widget.inputs.find((input) => input.name === 'title')?.value}
				</h1>
				<div className="container hidden sm:!grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 last:border-r-0 flex-wrap">
					{widget.inputs
						.slice()
						.sort(function (inputA, inputB) {
							return inputA.id - inputB.id;
						})
						.map((input, inputIndex) => (
							<>
								{input.name === 'offer_box' && input.items && (
									<div
										key={inputIndex}
										className="bg-white flex gap-4 px-4 py-6 group"
									>
										<span
											className="flex items-center text-4xl text-gray-700 group-hover:text-primary transition-all"
											dangerouslySetInnerHTML={{
												__html: `${
													input.items.find((item) => item.name === 'icon')
														?.value
												}`,
											}}
										></span>
										<div className="w-full">
											<h1 className="text-lg text-gray-700">
												{
													input.items.find((item) => item.name === 'title')
														?.value
												}
											</h1>
											<p className="text-gray-600">
												{
													input.items.find(
														(item) => item.name === 'description'
													)?.value
												}
											</p>
										</div>
									</div>
								)}
							</>
						))}
				</div>
			</section>
		</>
	);
};

export default OffersSection;
