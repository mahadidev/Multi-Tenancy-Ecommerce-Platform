import { darken, lighten } from 'polished';

const useColor = () => {
	const getColorShade = (color: string) => {
		const colors = {
		    100: lighten(0.4, color),
			200: lighten(0.3, color),
			300: lighten(0.2, color),
			400: lighten(0.1, color),
			500: color,
			600: darken(0.1, color),
			700: darken(0.2, color),
			800: darken(0.3, color),
			900: darken(0.4, color),
		};

		return colors;
	};

	const setColorShade = ({color, name}:{
        color: string;
        name: string
    }) => {
        const colors = getColorShade(color);

		Object.entries(colors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--${name}-${key}`, value);
		});
	};

	return {
		getColorShade,
		setColorShade,
	};
};
export default useColor;
