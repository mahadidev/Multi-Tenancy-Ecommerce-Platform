import { ThemeWidgetPropsType } from '@type/themeType';
import { FC } from 'react';

const Hero: FC<ThemeWidgetPropsType> = ({ widget }) => {
	return (
		<div>
			{/* title */}
			{widget.inputs.find((input) => input.name === 'title') && (
				<h1>{widget.inputs.find((input) => input.name === 'title')?.value}</h1>
			)}

			{/* description  */}
			{widget.inputs.find((input) => input.name === 'description') && (
				<p>
					{widget.inputs.find((input) => input.name === 'description')?.value}
				</p>
			)}
		</div>
	);
};
export default Hero;
