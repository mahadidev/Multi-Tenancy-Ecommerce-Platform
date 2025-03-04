import { CategoryType } from "@type/categoryType";
import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import { FaCoffee } from "react-icons/fa";

const CategoriesList: FC<ThemeWidgetPropsType> = ({ store }) => {
    return (
        <section className="w-full container px-4 lg:px-0 mx-auto my-3 lg:my-20 bg-white rounded-lg">
            <div className="-mt-1.5 mb-5 xl:mb-6 text-center pb-2 lg:pb-3 xl:pb-4 3xl:pb-7">
                <h2 className="text-brand-dark text-lg lg:text-xl xl:text-[22px] xl:leading-8 font-semibold font-manrope 3xl:text-[30px] 3xl:leading-9">
                    What food you love to order{" "}
                </h2>
                <p className="text-brand-muted text-sm leading-7 lg:text-15px xl:text-base pb-0.5 mt-1.5 lg:mt-2.5 xl:mt-3">
                    Here order your favorite foods from different categories
                </p>
            </div>
            <div className="grid sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                {store?.categories?.map(
                    (category: CategoryType, idx: number) => (
                        <a
                            key={idx}
                            href="/shop-left-sidebar-col-3"
                            className="hover:no-underline"
                        >
                            <div className="gi-cat-icon flex flex-col items-center hover:bg-gray-200 hover:duration-300 bg-gray-100 p-4 rounded-lg relative">
                                <span className="gi-lbl absolute top-2 left-2 bg-[#02b290] text-white text-xs px-2 py-1 rounded">
                                    10%
                                </span>
                                <FaCoffee className="text-4xl text-[#02b290]" />
                                <div className="gi-cat-detail text-center mt-3">
                                    <h4 className="gi-cat-title text-lg font-semibold">
                                        {category?.name}
                                    </h4>

                                    <p className="items text-gray-500 text-sm">
                                        48 Items
                                    </p>
                                </div>
                            </div>
                        </a>
                    )
                )}
            </div>
        </section>
    );
};

export default CategoriesList;
