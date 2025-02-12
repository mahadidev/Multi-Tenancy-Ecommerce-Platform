import { ThemeWidgetPropsType } from '@type/themeType';
import { FC } from 'react';

const Hero: FC<ThemeWidgetPropsType> = ({ widget }) => {
	return (
		<section className="py-4 bg-gray-400">
			<div className="container mx-auto">
				{/* title */}
				{widget.inputs.find((input) => input.name === 'title') && (
					<h1 className='text-3xl font-bold'>
						{widget.inputs.find((input) => input.name === 'title')?.value}
					</h1>
				)}

				{/* description  */}
				{widget.inputs.find((input) => input.name === 'description') && (
					<p className='text-base mt-5'>
						{widget.inputs.find((input) => input.name === 'description')?.value}
					</p>
				)}
			</div>
		</section>
	);
};
export default Hero;
