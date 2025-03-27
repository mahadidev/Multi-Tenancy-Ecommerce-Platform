import { ProductType } from "@type/productType";
import { FC } from "react";
import useCart from "../../../hooks/useCart";
import LoadingOverlay from "../../LoadingOverlay/LoadingOverlay";
import PriceStack from "../PriceStack/PriceStack";
import ProductActionCard from "../ProductAction/ProductActionCard";

interface ProductCardPropsType {
    product: ProductType;
}

const ProductCard: FC<ProductCardPropsType> = ({ product }) => {
    const { isLoadingCart, addToCart } = useCart();
    console.log({ isLoadingCart });
    return (
        <article
            className="flex flex-col group overflow-hidden rounded-md cursor-pointer transition-all duration-300 shadow-sm border hover:shadow-md relative h-full bg-white"
            title="Lay's Bar-B-Que Potato Chips relative"
        >
            <LoadingOverlay isLoading={isLoadingCart} />
            {/* Product Image */}
            <div className="mx-auto relative shrink-0 overflow-hidden w-full h-[180px]  md:h-[200px] transition-transform duration-200 flex flex-col justify-center ease-in-out transform group-hover:scale-105">
                <img
                    src={product?.thumbnail}
                    alt={product?.name}
                    className="bg-fill-thumbnail object-cover"
                />{" "}
                <div className="absolute hidden bottom-4 left-0 w-full mx-auto group-hover:block hover:duration-300">
                    <ProductActionCard
                        product={product}
                        onAddToCart={addToCart}
                    />
                </div>
            </div>

            {/* Product Info */}
            <div className="flex bg-gray-50 flex-col px-3 md:px-4 lg:px-5 pb-5 lg:pb-6 lg:pt-1.5 h-full">
                {/* Price */}
                <PriceStack product={product} />

                {/* Product Name */}
                <h2 className="text-gray-900 text-sm sm:text-base lg:text-lg leading-5 sm:leading-6 mb-1.5">
                    {product?.name}
                </h2>

                {/* Quantity Info */}
                <div className="mt-auto text-sm sm:text-base text-gray-600">
                    {product?.stock || 0} items
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
