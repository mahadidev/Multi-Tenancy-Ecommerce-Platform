import { SELLER_PREFIX } from "./store/env";

export const PATH_PREFIX = "/seller";

export const RoutePath = {
    login: "/login",
    register: "/login/create",
    storeOnboard: "/onboard/store",
    dashboard: "/",
    categories: {
        index: () => "/categories",
    },
    brands: {
        index: () => "/brands",
    },
    products: {
        index: () => "/products",
        href: {
            index: () => `${SELLER_PREFIX}/products`,
        },
        edit: (id: string | number) => `/products/${id}/edit`,
    },
    settings: "/settings",
    pages: {
        list: () => "/pages",
        edit: (id: string | number) => `/pages/${id}/edit`,
    },
    themes: {
        list: () => "/themes",
    },
    help: {
        index: () => "/help",
    },
    pricing: {
        index: () => "/pricing",
    },
};
