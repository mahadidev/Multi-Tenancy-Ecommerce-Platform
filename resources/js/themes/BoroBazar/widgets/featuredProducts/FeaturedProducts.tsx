import { ProductType } from "@type/productType";
import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import ProductCard from "../../components/Product/ProductCard/ProductCard";
import SectionTitle from "../../components/SectionTitle/SectionTitle";

const FeaturedProducts: FC<ThemeWidgetPropsType> = ({ store }) => {
    return (
        <section className="w-full container px-4 lg:px-0 mx-auto my-10 bg-white rounded-lg">
            <SectionTitle
                title="Featured Products"
                tagline="We provide best quality &amp; fresh grocery items near your
                    location"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-5">
                {store?.featuredProducts?.map((product: ProductType, idx) => (
                    <ProductCard key={idx} product={product} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
