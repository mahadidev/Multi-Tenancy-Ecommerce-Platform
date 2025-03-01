import { ThemeWidgetPropsType } from '@type/themeType';
import { Card } from 'flowbite-react';
import { FC } from 'react';

const OffersSection: FC<ThemeWidgetPropsType> = ({ widget }) => {
	return (
		<section className="py-4 bg-gray-400">
			<div className="container mx-auto">
				{/* title */}
				{widget.inputs.find((input) => input.name === 'title') && (
					<h1 className="text-3xl font-bold">
						{widget.inputs.find((input) => input.name === 'title')?.value}
					</h1>
				)}

				{/* Offer Grid Box */}
				{widget.inputs.find((input) => input.name === 'offers') && (
					<div className="grid grid-cols-4 gap-4 mt-5">
						{widget.inputs
							.filter((input) => input.name === 'offers')
							.map((input) => (
								<Card>
									<div>
										{input.child?.find((childItem) => childItem.name === 'icon')?.value}
									</div>

									<h2>
										{input.child?.find((childItem) => childItem.name === 'title')?.value}
									</h2>

									<p>
										{
											input.child?.find((childItem) => childItem.name === 'description')
												?.value
										}
									</p>
								</Card>
							))}
					</div>
				)}
			</div>
		</section>
	);
};
export default OffersSection;
