import flowbite from 'flowbite-react/tailwind';

module.exports = {
	content: [
		'./resources/js/themes/sources/dokan/**/*.{ts,tsx,mdx}',
		flowbite.content(),
	],
	plugins: [],
};
