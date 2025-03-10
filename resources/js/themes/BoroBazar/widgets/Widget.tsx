import { ThemeWidgetPropsType } from "@type/themeType";
import React, { FC } from "react";
import AllProducts from "./allProducts/AllProducts";
import FeaturedProducts from "./featuredProducts/FeaturedProducts";
import Hero from "./hero/Hero";
import LatestProducts from "./latestProducts/LatestProduct";
import OfferBanner from "./offerBanner/OfferBanner";
import OffersSection from "./offerSection/OfferSection";
import PageBanner from "./pageBanner/PageBanner";

const Widget: FC<ThemeWidgetPropsType> = (props) => {
    const widgets: {
        [Key: string]: React.ReactNode;
    } = {
        hero: <Hero {...props} />,
        featuresSection: <OffersSection {...props} />,
        featuredProducts: <FeaturedProducts {...props} />,
        offerBanner: <OfferBanner {...props} />,
        latestProducts: <LatestProducts {...props} />,
        pageBanner: <PageBanner {...props} />,
        allProducts: <AllProducts {...props} />,
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
