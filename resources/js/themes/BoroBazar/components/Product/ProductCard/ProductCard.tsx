import { ProductType } from "@type/productType";
import { FC } from "react";
import ProductActionCard from "../ProductAction/ProductActionCard";

interface ProductCardPropsType {
    product: ProductType;
}

const ProductCard: FC<ProductCardPropsType> = ({ product }) => {
    return (
        <article
            className="flex flex-col group overflow-hidden rounded-md cursor-pointer transition-all duration-300 shadow-sm relative h-full bg-white shadow-card hover:shadow-cardHover border"
            title="Lay's Bar-B-Que Potato Chips"
        >
            {/* Product Image */}
            <div className="mx-auto relative shrink-0 overflow-hidden w-full h-[180px]  md:h-[200px] transition-transform duration-200 flex flex-col justify-center ease-in-out transform group-hover:scale-105">
                <img
                    src={product?.thumbnail}
                    alt="Lay's Bar-B-Que Potato Chips"
                    className="bg-fill-thumbnail object-cover group-hover:scale-110"
                />{" "}
                <div className="absolute bottom-4 left-0 w-full mx-auto duration-300">
                    <ProductActionCard product={product} />
                </div>
            </div>

            {/* Product Info */}
            <div className="flex bg-gray-50 flex-col px-3 md:px-4 lg:px-5 pb-5 lg:pb-6 lg:pt-1.5 h-full">
                {/* Price */}
                <div className="mb-1 lg:mb-1.5 -mx-1">
                    <span className="inline-block mx-1 text-sm font-semibold sm:text-base lg:text-lg text-gray-800">
                        {product?.discount_price
                            ? `$${product?.discount_price} - $${product?.price}`
                            : `$${product?.price}`}
                    </span>
                </div>

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
