import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import { BsChevronRight } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const PageBanner: FC<ThemeWidgetPropsType> = ({ widget, store }) => {
    return (
        <section>
            {widget.inputs.find((input) => input.name === "bannerLink") && (
                <div
                    className={`bg-[url(${
                        widget?.inputs?.find(
                            (input) => input.name === "bannerLink"
                        )?.value
                    })] h-[400px] w-full bg-no-repeat bg-cover flex items-center justify-center`}
                >
                    <div className="relative flex flex-col items-center justify-center w-full">
                        <h2 className="text-xl md:text-2xl lg:text-3xl 2xl:text-[40px] font-bold text-center text-brand-light">
                            <span className="block mb-3 font-bold font-manrope md:mb-4 lg:mb-5 2xl:mb-7">
                                {
                                    widget?.inputs?.find(
                                        (input) => input.name === "pageName"
                                    )?.value
                                }
                            </span>
                        </h2>
                        <div className="flex items-center">
                            <ol className="flex items-center w-full overflow-hidden">
                                <li className="text-sm text-brand-muted px-2.5 transition duration-200 ease-in first:pl-0 last:pr-0 hover:text-brand-dark">
                                    <Link
                                        className="inline-flex items-center"
                                        to={`/sites/${store?.slug}`}
                                    >
                                        <FaHome
                                            className="mr-1.5 text-brand-dark text-[15px]"
                                            size={16}
                                        />{" "}
                                        Home
                                    </Link>
                                </li>
                                <li className="text-base text-brand-dark mt-[1px]">
                                    <BsChevronRight
                                        className="text-brand-dark text-opacity-40 text-[15px]"
                                        size={16}
                                    />
                                </li>
                                <li className="text-sm text-brand-muted px-2.5 transition duration-200 ease-in first:pl-0 last:pr-0 hover:text-brand-dark">
                                    <p className="capitalize text-[15px]">
                                        {
                                            widget?.inputs?.find(
                                                (input) =>
                                                    input.name ===
                                                    "currentPageBreadcrumbLabel"
                                            )?.value
                                        }
                                    </p>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PageBanner;
// 'https://i.ibb.co.com/N6F5H9Tq/shop-banner-1.jpg'
