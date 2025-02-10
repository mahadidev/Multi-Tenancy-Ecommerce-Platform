import flowbite from 'flowbite-react/tailwind';

module.exports = {
	content: [
		'./resources/js/themes/**/*.{ts,tsx,mdx}',
		flowbite.content(),
	],
	plugins: [flowbite.plugin()],
};
