import { ThemeWidgetPropsType } from "@type/themeType";
import React, { FC } from "react";
import AboutUsSection from "./aboutUs/AboutUs";
import FeaturedProducts from "./featuredProducts/FeaturedProducts";
import Hero from "./hero/Hero";
import Introduction from "./introduction/Introduction";
import OffersSection from "./offerSection/OfferSection";

const Widget: FC<ThemeWidgetPropsType> = (props) => {
    const widgets: {
        [Key: string]: React.ReactNode;
    } = {
        hero: <Hero {...props} />,
        featuredProducts: <FeaturedProducts {...props} />,
        introduction: <Introduction {...props} />,
        offersSection: <OffersSection {...props} />,
        aboutUsSection: <AboutUsSection {...props} />,
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
