import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
	darkMode: ['class'],
	content: [
		'./resources/js/frontend/**/*.{js,ts,jsx,tsx}',
		'./resources/js/frontend/**/*.js',
		'./resources/js/frontend/**/*.tsx',
		'./resources/js/frontend/**/*.vue',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Mona Sans', ...defaultTheme.fontFamily.sans],
				popp: ['Poppins', ...defaultTheme.fontFamily.sans],
				myriad: ['myriad', 'system-ui'],
				ibrand: ['ibrand', 'system-ui'],
			},
			colors: {
				primary: {
					DEFAULT: '#1a453c', // Dark Green (used in headings and buttons)
					light: '#d6ea59', // Fresh green tone
				},
				neutral: {
					DEFAULT: '#f5f1eb', // Light Beige (background)
					dark: '#1E1E1E', // Almost black for text
				},
				background: '#f5f1eb',
			},
			container: {
				center: true,
				padding: '1rem',
				screens: {
					'2xl': '1200px',
				},
			},
		},
	},
};
