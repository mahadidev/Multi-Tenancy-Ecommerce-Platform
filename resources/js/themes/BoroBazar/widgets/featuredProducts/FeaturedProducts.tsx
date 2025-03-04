import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import { FaPlus } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

const FeaturedProducts: FC<ThemeWidgetPropsType> = () => {
    return (
        <section className="w-full container px-4 lg:px-0 mx-auto my-3 lg:my-20 bg-white rounded-lg">
            <div className="-mt-1.5 mb-5 xl:mb-6 text-center pb-2 lg:pb-3 xl:pb-4 3xl:pb-7">
                <h2 className="text-brand-dark text-lg lg:text-xl xl:text-[22px] xl:leading-8 font-semibold font-manrope 3xl:text-[30px] 3xl:leading-9">
                    Best seller grocery near you
                </h2>
                <p className="text-brand-muted text-sm leading-7 lg:text-15px xl:text-base pb-0.5 mt-1.5 lg:mt-2.5 xl:mt-3">
                    We provide best quality &amp; fresh grocery items near your
                    location
                </p>
            </div>
            {/* {JSON.stringify(store?.featuredProducts, null, 2)} */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {new Array(12).fill(12)?.map((_, idx) => (
                    <article
                        key={idx}
                        className="flex flex-col group overflow-hidden rounded-md cursor-pointer transition-all duration-300 shadow-md relative h-full bg-white shadow-card hover:shadow-cardHover border"
                        title="Lay's Bar-B-Que Potato Chips"
                    >
                        {/* Product Image */}
                        <div className="mx-auto relative shrink-0 overflow-hidden w-full h-[180px]  md:h-[200px] transition-transform duration-200 ease-in-out transform group-hover:scale-105">
                            <img
                                src="https://grabit-react-next.maraviyainfotech.com/assets/img/product-images/2_1.jpg"
                                alt="Lay's Bar-B-Que Potato Chips"
                                className="bg-fill-thumbnail object-cover group-hover:scale-110"
                            />{" "}
                            {/* Quick View Button */}
                            <div className="absolute grid gap-2 bottom-2 right-2 z-10">
                                <button
                                    className="inline-flex items-center justify-center w-8 h-8 text-xl rounded-full bg-teal-500 text-white lg:w-10 lg:h-10 focus:outline-none"
                                    aria-label="Quick View"
                                >
                                    <FiEye />
                                </button>
                                <button
                                    className="inline-flex items-center justify-center w-8 h-8 text-xl rounded-full bg-teal-500 text-white lg:w-10 lg:h-10 focus:outline-none"
                                    aria-label="Add to Cart"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col px-3 md:px-4 lg:px-5 pb-5 lg:pb-6 lg:pt-1.5 h-full">
                            {/* Price */}
                            <div className="mb-1 lg:mb-1.5 -mx-1">
                                <span className="inline-block mx-1 text-sm font-semibold sm:text-base lg:text-lg text-gray-800">
                                    $5.00 - $15.00
                                </span>
                            </div>

                            {/* Product Name */}
                            <h2 className="text-gray-900 text-sm sm:text-base lg:text-lg leading-5 sm:leading-6 mb-1.5">
                                Lay's Bar-B-Que Potato Chips
                            </h2>

                            {/* Quantity Info */}
                            <div className="mt-auto text-sm sm:text-base text-gray-600">
                                1 each
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
