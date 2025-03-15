import { ThemeWidgetPropsType } from "@type/themeType";
import React, { FC } from "react";
import AllProducts from "./allProducts/AllProducts";
import FeaturedProducts from "./featuredProducts/FeaturedProducts";
import FeaturesSection from "./featuresSection/FeaturesSection";
import Hero from "./hero/Hero";
import LatestProducts from "./latestProducts/LatestProduct";
import OfferBanner from "./offerBanner/OfferBanner";
import PageBanner from "./pageBanner/PageBanner";
import RegistrationPage from "./registration/Registration";

const Widget: FC<ThemeWidgetPropsType> = (props) => {
    const widgets: {
        [Key: string]: React.ReactNode;
    } = {
        hero: <Hero {...props} />,
        featuresSection: <FeaturesSection {...props} />,
        featuredProducts: <FeaturedProducts {...props} />,
        offerBanner: <OfferBanner {...props} />,
        latestProducts: <LatestProducts {...props} />,
        pageBanner: <PageBanner {...props} />,
        allProducts: <AllProducts {...props} />,
        registration: <RegistrationPage {...props} />,
    };

    return (
        <>
            {widgets[props.widget.name] ?? (
                <h1>{props.widget.name} Widget not found</h1>
            )}
        </>
    );
};
export default Widget;
