import { CategoryType } from "@type/categoryType";
import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import { FaCoffee } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";

const CategoriesList: FC<ThemeWidgetPropsType> = ({ store }) => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 8,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
        },
    };
    return (
        <section className="w-full container px-4 lg:px-0 mx-auto my-3 lg:my-20 bg-white rounded-lg">
            <SectionTitle
                title="What food you love to order"
                tagline="Here order your favorite foods from different categories"
            />

            <Carousel
                swipeable={false}
                draggable={false}
                showDots={false}
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={4000}
                customTransition="all 2"
                transitionDuration={2000}
                containerClass="carousel-container"
                arrows={true}
                itemClass="carousel-item-padding-40-px mx-3"
            >
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
            </Carousel>
        </section>
    );
};

export default CategoriesList;
