export const PATH_PREFIX = "/seller";

export const RoutePath = {
    login: "/login",
    register: "/login/create",
    storeOnboard: "/onboard/store",
    dashboard: "/",
    products: "/e-commerce/products",
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
