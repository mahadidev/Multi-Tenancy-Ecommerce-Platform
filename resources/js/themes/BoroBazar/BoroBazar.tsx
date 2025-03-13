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
import AllProductsJson from "./widgets/allProducts/AllProducts.json";
import FeaturedProductsJson from "./widgets/featuredProducts/FeaturedProduct.json";
import FeaturesSectionJson from "./widgets/featuresSection/FeaturesSection.json";
import HeroJson from "./widgets/hero/Hero.json";
import LatestProductsJson from "./widgets/latestProducts/LatestProduct.json";
import OfferBannerJson from "./widgets/offerBanner/OfferBanner.json";
import PageBannerJson from "./widgets/pageBanner/PageBanner.json";

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
    widgets: [AppLayoutJson, NavigationJson, FooterJson],
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
            id: 0,
            name: "shop",
            label: "Shop",
            slug: "/shop",
            title: "Shop Page",
            layout: AppLayoutJson,
            is_active: 1,
            type: "shope",
            thumbnail: null,
            widgets: [PageBannerJson, AllProductsJson],
        },
    ],
};
