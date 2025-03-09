import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import { Link } from "react-router-dom";

const OfferBanner: FC<ThemeWidgetPropsType> = ({ widget }) => {
    return (
        <>
            <section className="mx-auto my-12 lg:mb-14 xl:pb-3 h-[400px]">
                {widget.inputs.find((input) => input.name === "offerLink") && (
                    <Link
                        to={
                            widget?.inputs?.find(
                                (input) => input.name === "offerLink"
                            )?.value || "/"
                        }
                        className="h-full group flex justify-center relative overflow-hidden"
                    >
                        {widget?.inputs?.find(
                            (input) => input.name === "offerBannerUrl"
                        ) && (
                            <img
                                alt="Super Discount 70% Off"
                                width={1840}
                                height={400}
                                className="bg-fill-thumbnail object-cover w-full"
                                src={
                                    widget?.inputs?.find(
                                        (input) =>
                                            input.name === "offerBannerUrl"
                                    )?.value
                                }
                            />
                        )}
                    </Link>
                )}
            </section>
        </>
    );
};

export default OfferBanner;
