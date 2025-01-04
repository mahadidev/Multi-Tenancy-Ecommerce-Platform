const document: {
    head: {
        querySelector: CallableFunction;
    };
} = window.document;

export const BASE_URL: string = document.head.querySelector(
    'meta[name="base-url"]'
)
    ? document.head.querySelector('meta[name="base-url"]').content
    : "http://localhost:8000";

export const API_URL = BASE_URL + "/api/v1";

export const SELLER_PREFIX = "/seller";

export const APP_NAME: string = document.head.querySelector(
    'meta[name="app-name"]'
)
    ? document.head.querySelector('meta[name="app-name"]').content
    : "Cholo Gori E-Com";
