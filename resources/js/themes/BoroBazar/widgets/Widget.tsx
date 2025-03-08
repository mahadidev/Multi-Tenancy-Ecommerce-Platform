import { ThemeWidgetPropsType } from "@type/themeType";
import React, { FC } from "react";
import AllProducts from "./allProducts/AllProducts";
import CategoriesList from "./categoriesList/CategoriesList";
import FeaturedProducts from "./featuredProducts/FeaturedProducts";
import Hero from "./hero/Hero";
import LatestProducts from "./latestProducts/LatestProduct";
import OfferBanner from "./offerBanner/OfferBanner";
import PageBanner from "./pageBanner/PageBanner";

const Widget: FC<ThemeWidgetPropsType> = (props) => {
    const widgets: {
        [Key: string]: React.ReactNode;
    } = {
        hero: <Hero {...props} />,
        categoriesList: <CategoriesList {...props} />,
        featuredProducts: <FeaturedProducts {...props} />,
        pageBanner: <PageBanner {...props} />,
        allProducts: <AllProducts {...props} />,
        latestProducts: <LatestProducts {...props} />,
        offerBanner: <OfferBanner {...props} />,
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
