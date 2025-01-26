import flowbite from 'flowbite-react/tailwind';

module.exports = {
	content: [
		'./resources/js/themes/sources/dokan/**/*.{ts,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#FFC100',
				'primary-hover': '#ffae00',
				secondary: '#360B4C',
				third: '#FF2B83',
			},
			container: {
				center: true,
                padding: "1rem"
			},
			boxShadow: {
				lg: 'rgb(0 0 0 / 0%) 0px 0px, rgb(0 0 0 / 0%) 0px 0px, rgb(0 0 0 / 6%) 0px 34px 68px',
			},
		},
	},
	plugins: [],
};
