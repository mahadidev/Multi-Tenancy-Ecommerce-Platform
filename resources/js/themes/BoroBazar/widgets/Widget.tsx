import { ThemeWidgetPropsType } from "@type/themeType";
import React, { FC } from "react";
import AllProducts from "./allProducts/AllProducts";
import CartProducts from "./cartProducts/CartProducts";
import PlaceOrder from "./checkout/PlaceOrder";
import FeaturedProducts from "./featuredProducts/FeaturedProducts";
import FeaturesSection from "./featuresSection/FeaturesSection";
import Hero from "./hero/Hero";
import LatestProducts from "./latestProducts/LatestProduct";
import Login from "./login/Login";
import MyOrders from "./myOrders/MyOrders";
import MyProfile from "./myProfile/MyProfile";
import OfferBanner from "./offerBanner/OfferBanner";
import OrderSuccess from "./orderSuccess/OrderSuccess";
import PageBanner from "./pageBanner/PageBanner";
import Registration from "./registration/Registration";
import TrackOrders from "./trackOrders/TrackOrders";

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
        registration: <Registration {...props} />,
        login: <Login {...props} />,
        cart: <CartProducts {...props} />,
        placeOrder: <PlaceOrder {...props} />,
        orderSuccess: <OrderSuccess {...props} />,
        myProfile: <MyProfile {...props} />,
        myOrders: <MyOrders {...props} />,
        trackOrders: <TrackOrders {...props} />,
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
