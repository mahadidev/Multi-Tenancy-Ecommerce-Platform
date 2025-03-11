import { ProductType } from "@type/productType";
import { FC } from "react";
import ProductActionCard from "../ProductAction/ProductActionCard";

interface ProductCardPropsType {
    product: ProductType;
}

const ProductCardListView: FC<ProductCardPropsType> = ({ product }) => {
    return (
        <article
            className="grid grid-cols-2 gap-4 p-4 bg-white border rounded-md shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
            title={product?.name}
        >
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-md">
                <img
                    src={product?.thumbnail}
                    alt={product?.name}
                    className="object-cover w-full h-[200px] transition-transform duration-200 ease-in-out transform group-hover:scale-105"
                />
                <div className="absolute hidden bottom-4 left-0 w-full mx-auto group-hover:block hover:duration-300">
                    <ProductActionCard product={product} />
                </div>
            </div>

            {/* Product Info */}
            <div className="">
                {/* Product Name */}
                <h2 className="text-gray-900 text-xl font-semibold">
                    {product?.name}
                </h2>
                {/* Price */}
                <div className="text-gray-800 text-base font-semibold my-2">
                    {product?.discount_price
                        ? `$${product?.discount_price} - $${product?.price}`
                        : `$${product?.price}`}
                </div>
                {/* Quantity Info */}
                <div className="text-gray-600 text-md my-2">
                    {product?.stock || 0} items available
                </div>{" "}
                <p className="text-gray-600 text-sm my-2">
                    {product?.short_description ||
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat officiis fugiat aut"}
                </p>
            </div>
        </article>
    );
};

export default ProductCardListView;
