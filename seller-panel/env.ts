// fetch from html
const document: {
	head: {
		querySelector: CallableFunction;
	};
} = window.document;
export const BASE_URL: string = document.head.querySelector(
	'meta[name="base-url"]'
)
	? document.head.querySelector('meta[name="base-url"]').content
	: 'http://localhost:8000';

// variables
export const PREFIX = "/seller"
export const BASE_IMAGE_URL = `${BASE_URL}/images`;
export const API_URL = BASE_URL + '/api/v1';
export const APP_NAME: string = document.head.querySelector(
	'meta[name="app-name"]'
)?.content;
