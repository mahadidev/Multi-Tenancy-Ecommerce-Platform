import { ThemeWidgetPropsType } from "@type/themeType";
import React, { FC } from "react";
import BannersSection from "./banners/Banners";
import FeaturedProducts from "./featuredProducts/FeaturedProducts";
import FeaturesSection from "./features/FeaturesSection";
import Hero from "./hero/Hero";

const Widget: FC<ThemeWidgetPropsType> = (props) => {
    const widgets: {
        [Key: string]: React.ReactNode;
    } = {
        hero: <Hero {...props} />,
        featuresSection: <FeaturesSection {...props} />,
        featuredProducts: <FeaturedProducts {...props} />,
        bannersSection: <BannersSection {...props} />,
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
