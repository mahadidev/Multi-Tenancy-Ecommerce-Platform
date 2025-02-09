const document: {
	head: {
		querySelector: CallableFunction;
	};
} = window.document;

export const SITE_SLUG = document.head.querySelector(
	'meta[name="site-slug"]'
)?.content;


export const USER_PREFIX = '/user';
