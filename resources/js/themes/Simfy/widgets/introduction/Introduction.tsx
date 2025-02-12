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
					<div className="grid grid-cols-4 gap-4">
						{widget.inputs
							.filter((input) => input.name !== 'offers')
							.map((input) => (
								<Card>
									<div>
										{input.items?.find((item) => item.name === 'icon')?.value}
									</div>

									<h2>
										{input.items?.find((item) => item.name === 'title')?.value}
									</h2>

									<p>
										{
											input.items?.find((item) => item.name === 'description')
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
