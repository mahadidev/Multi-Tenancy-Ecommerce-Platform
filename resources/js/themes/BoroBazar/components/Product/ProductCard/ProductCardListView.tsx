import { ProductType } from "@type/productType";
import { FC } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProductQuickViewModal from "../ProductQuickView/ProductQuickViewModal";

interface ProductCardPropsType {
    product: ProductType;
}

const ProductCardListView: FC<ProductCardPropsType> = ({ product }) => {
    return (
        <article
            className="grid grid-cols-2 gap-4 p-4 bg-white border rounded-md shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            title={product?.name}
        >
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-md group">
                <img
                    src={product?.thumbnail}
                    alt={product?.name}
                    className="object-cover w-full h-[200px] transition-transform duration-200 ease-in-out transform group-hover:scale-105"
                />
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
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat officiis fugiat aut at architecto cupiditate ea error est perspiciatis nobis. Inventore hic eius doloribus rerum"}
                </p>
                {/* Quick View & Add to Cart */}
                <div className="flex items-center gap-2 mt-5">
                    <button
                        className="text-xl px-3 py-1 flex items-center gap-3 justify-center bg-[#02b290] hover:bg-[#4cb49f] hover:duration-300 text-white rounded-md focus:outline-none"
                        aria-label="Add to Cart"
                        onClick={() => alert(product?.name)}
                    >
                        <AiOutlineShoppingCart /> Add to Cart
                    </button>
                    <ProductQuickViewModal product={product} />
                </div>
            </div>
        </article>
    );
};

export default ProductCardListView;
