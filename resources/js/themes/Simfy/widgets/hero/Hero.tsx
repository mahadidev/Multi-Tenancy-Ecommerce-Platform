import { ThemeWidgetPropsType } from '@type/themeType';
import { FC } from 'react';

const HeroSection: FC<ThemeWidgetPropsType> = ({ widget }) => {
	return (
		<section className="py-4 bg-gray-400">
			<div className="container mx-auto">
				{/* title */}
				{widget.inputs.find((input) => input.name === 'title') && (
					<h1 className='text-3xl font-bold'>
						{widget.inputs.find((input) => input.name === 'title')?.value}
					</h1>
				)}
			</div>
		</section>
	);
};
export default HeroSection;
