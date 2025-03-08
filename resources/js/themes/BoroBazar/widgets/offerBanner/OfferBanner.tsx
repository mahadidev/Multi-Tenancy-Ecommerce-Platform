import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import { Link } from "react-router-dom";

const OfferBanner: FC<ThemeWidgetPropsType> = () => {
    return (
        <div className="mx-auto mb-12 lg:mb-14 xl:pb-3">
            <Link
                to="/en/search"
                className="h-full group flex justify-center relative overflow-hidden"
            >
                <img
                    alt="Super Discount 70% Off"
                    width={1840}
                    height={400}
                    className="bg-fill-thumbnail object-cover w-full"
                    src="https://i.ibb.co.com/bZB0nq3/image.webp"
                />
            </Link>
        </div>
    );
};

export default OfferBanner;
