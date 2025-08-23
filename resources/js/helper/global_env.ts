const document: {
	head: {
		querySelector: CallableFunction;
	};
} = window.document;

export const GLOBAL_APP_URL = document.head.querySelector(
	'meta[name="base-url"]'
).content;

export const GLOBAL_APP_API_URL = GLOBAL_APP_URL + "/api/v1"

export const GLOBAL_APP_SITE_PATH = `${GLOBAL_APP_URL}/sites`;

export const WEBSITE_RENDERER_URL = document.head.querySelector(
	'meta[name="website-renderer-url"]'
).content;
