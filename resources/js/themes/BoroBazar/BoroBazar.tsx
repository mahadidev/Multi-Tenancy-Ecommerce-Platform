import {
    ThemeLayoutPropsType,
    ThemeType,
    ThemeWidgetPropsType,
} from "@type/themeType";
import Layout from "./layouts/Layout";
import Widget from "./widgets/Widget";
// import layout json
import AppLayoutJson from "./layouts/appLayout/AppLayout.json";
import FooterJson from "./layouts/footer/Footer.json";
import NavigationJson from "./layouts/navigation/Navigation.json";

// import widget json
import { RegisteredThemeType } from "@themes/registeredTheme";
import AuthLayoutJson from "./layouts/authLayout/AuthLayout.json";
import AllProductsJson from "./widgets/allProducts/AllProducts.json";
import CartProductsJson from "./widgets/cartProducts/CartProducts.json";
import PlaceOrderJson from "./widgets/checkout/PlaceOrder.json";
import FeaturedProductsJson from "./widgets/featuredProducts/FeaturedProduct.json";
import FeaturesSectionJson from "./widgets/featuresSection/FeaturesSection.json";
import HeroJson from "./widgets/hero/Hero.json";
import LatestProductsJson from "./widgets/latestProducts/LatestProduct.json";
import LoginJson from "./widgets/login/Login.json";
import OfferBannerJson from "./widgets/offerBanner/OfferBanner.json";
import PageBannerJson from "./widgets/pageBanner/PageBanner.json";
import RegistrationJson from "./widgets/registration/Registration.json";

export const BoroBazar: RegisteredThemeType = {
    name: "BoroBazar",
    widget: (props: ThemeWidgetPropsType) => <Widget {...props} />,
    layout: (props: ThemeLayoutPropsType) => <Layout {...props} />,
};

export const BoroBazarSeeder: ThemeType | any = {
    id: 1,
    name: BoroBazar.name,
    slug: BoroBazar.name.toLowerCase().replaceAll(" ", "-"),
    thumbnail: null,
    widgets: [AppLayoutJson, AuthLayoutJson, NavigationJson, FooterJson],
    pages: [
        {
            id: 0,
            name: "home",
            label: "Home",
            slug: "/",
            title: "Home Page",
            layout: AppLayoutJson,
            is_active: 1,
            type: "home",
            thumbnail: null,
            widgets: [
                HeroJson,
                FeaturesSectionJson,
                FeaturedProductsJson,
                OfferBannerJson,
                LatestProductsJson,
            ],
        },
        {
            id: 1,
            name: "shop",
            label: "Shop",
            slug: "/shop",
            title: "Shop Page",
            layout: AppLayoutJson,
            is_active: 1,
            type: "shop",
            thumbnail: null,
            widgets: [PageBannerJson, AllProductsJson],
        },
        {
            id: 2,
            name: "single-products",
            label: "Single-Products",
            slug: "/single-products",
            title: "Single Products Page",
            layout: AppLayoutJson,
            is_active: 1,
            type: "single-products",
            thumbnail: null,
            widgets: [PageBannerJson, AllProductsJson],
        },
        {
            id: 3,
            name: "registration",
            label: "Registration Page",
            slug: "/register",
            title: "Registration Page",
            // layout: AuthLayoutJson,
            layout: AppLayoutJson,
            is_active: 1,
            type: "register",
            thumbnail: null,
            widgets: [RegistrationJson],
        },
        {
            id: 4,
            name: "registration",
            label: "Login Page",
            slug: "/login",
            title: "Login Page",
            // layout: AuthLayoutJson,
            layout: AppLayoutJson,
            is_active: 1,
            type: "login",
            thumbnail: null,
            widgets: [LoginJson],
        },
        {
            id: 5,
            name: "cart",
            label: "Cart Page",
            slug: "/cart",
            title: "Cart Page",
            // layout: AuthLayoutJson,
            layout: AppLayoutJson,
            is_active: 1,
            type: "cart",
            thumbnail: null,
            widgets: [PageBannerJson, CartProductsJson],
        },
        {
            id: 6,
            name: "checkout",
            label: "Checkout Page",
            slug: "/checkout",
            title: "Checkout Page",
            layout: AppLayoutJson,
            is_active: 1,
            type: "checkout",
            thumbnail: null,
            widgets: [PageBannerJson, PlaceOrderJson],
        },
    ],
};
