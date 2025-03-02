import {
    ThemeLayoutPropsType,
    ThemeType,
    ThemeWidgetPropsType,
} from "@type/themeType";
import Layout from "./layouts/Layout";

// import layout json
import AppLayoutJson from "./layouts/appLayout/AppLayout.json";
import FooterJson from "./layouts/footer/Footer.json";
import NavigationJson from "./layouts/navigation/Navigation.json";

// import widget json
import { RegisteredThemeType } from "@themes/registeredTheme";
import AboutUsSectionJson from "./widgets/aboutUs/AboutUs.json";
import HeroJson from "./widgets/hero/Hero.json";
import IntroductionJson from "./widgets/introduction/Introduction.json";
import OfferSectionJson from "./widgets/offerSection/OfferSection.json";
import Widget from "./widgets/Widget";

export const RapidShopper: RegisteredThemeType = {
    name: "RapidShopper",
    widget: (props: ThemeWidgetPropsType) => <Widget {...props} />,
    layout: (props: ThemeLayoutPropsType) => <Layout {...props} />,
};

export const RapidShopperSeeder: ThemeType | any = {
    id: 1,
    name: RapidShopper.name,
    slug: RapidShopper.name.toLowerCase().replaceAll(" ", "-"),
    thumbnail: null,
    widgets: [AppLayoutJson, NavigationJson, FooterJson, OfferSectionJson],
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
                IntroductionJson,
                OfferSectionJson,
                AboutUsSectionJson,
            ],
        },
        {
            id: 0,
            name: "aboutus",
            label: "About us",
            slug: "/aboutus",
            title: "About Us Page",
            layout: AppLayoutJson,
            is_active: 1,
            type: "about",
            thumbnail: null,
            widgets: [AboutUsSectionJson],
        },
    ],
};
