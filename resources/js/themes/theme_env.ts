const document: {
	head: {
		querySelector: CallableFunction;
	};
} = window.document;

export const THEME_SLUG = document.head.querySelector(
	'meta[name="theme-slug"]'
)?.content;
