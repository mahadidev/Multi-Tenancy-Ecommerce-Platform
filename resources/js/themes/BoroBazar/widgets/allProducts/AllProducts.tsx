import { ProductType } from "@type/productType";
import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import ShopSidebar from "../shop-sidebar/ShopSidebar";

const AllProducts: FC<ThemeWidgetPropsType> = ({ store }) => {
    return (
        <section className="w-full container px-4 lg:px-0 mx-auto my-3 lg:my-20 bg-white rounded-lg">
            <SectionTitle title="All Products" position="left" />

            <div className="lg:flex gap-5 w-full">
                <div className="lg:w-3/12">
                    <ShopSidebar />
                </div>
                <div className="lg:w-9/12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {store?.featuredProducts?.map(
                        (product: ProductType, idx) => (
                            <ProductCard key={idx} product={product} />
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default AllProducts;
