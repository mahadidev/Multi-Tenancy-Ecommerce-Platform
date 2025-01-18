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
    },
    settings: "/settings",
    pages: {
        list: () => "/pages",
        edit: (id: string) => `/pages/${id}`,
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
