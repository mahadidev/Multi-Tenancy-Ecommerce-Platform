import flowbite from 'flowbite-react/tailwind';
import colors from 'tailwindcss/colors';

module.exports = {
	content: ['./resources/js/seller/**/*.{ts,tsx,mdx}', flowbite.content()],
	theme: {
		fontFamily: {
			myriad: ['myriad', 'system-ui'],
			ibrand: ['ibrand', 'system-ui'],
		},
		extend: {
			colors: {
				primary: {
					DEFAULT: '#1a453c',
					50: '#f0f8f6',
					100: '#d0e6e0',
					200: '#a1d2c1',
					300: '#72bfa3',
					400: '#4ba682',
					500: '#1a453c', // your primary color
					600: '#173c33',
					700: '#123026',
					800: '#0d221a',
					900: '#091614',
				},
				secondary: {
					DEFAULT: '#d6ea59',
					50: '#f6fce2',
					100: '#e1f7a7',
					200: '#c3f373',
					300: '#a4ee3f',
					400: '#86e20b',
					500: '#d6ea59', // your secondary color
					600: '#a7c848',
					700: '#7a9f37',
					800: '#4d7f26',
					900: '#205f15',
				},
				light: {
					DEFAULT: '#f5f1eb',
					50: '#ffffff', // Light Beige
					100: '#f9f7f3',
					200: '#f5f1eb', // your light color
					300: '#e5d9c6',
					400: '#d6c1a2',
					500: '#b7a280',
					600: '#9a8c66',
					700: '#7e6f4b',
					800: '#625a30',
					900: '#474521',
				},
				dark: {
					DEFAULT: '#333333',
					50: '#e0e0e0',
					100: '#b3b3b3',
					200: '#808080',
					300: '#4d4d4d',
					400: '#333333', // your dark color
					500: '#1a1a1a',
					600: '#141414',
					700: '#0f0f0f',
					800: '#0a0a0a',
					900: '#050505',
				},
			},
		},
	},
	plugins: [flowbite.plugin()],
};
