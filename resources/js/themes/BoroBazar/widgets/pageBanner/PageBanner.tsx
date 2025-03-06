import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";

const PageBanner: FC<ThemeWidgetPropsType> = () => {
    return (
        <div className="bg-[url('https://i.ibb.co.com/N6F5H9Tq/shop-banner-1.jpg')] h-[400px] w-full bg-no-repeat bg-cover"></div>
    );
};

export default PageBanner;
