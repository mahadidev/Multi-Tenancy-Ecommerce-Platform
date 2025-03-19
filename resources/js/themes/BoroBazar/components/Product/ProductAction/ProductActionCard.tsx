import { ProductType } from "@type/productType";
import { FC } from "react";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import useCart from "../../../hooks/useCart";
import ProductQuickViewModal from "../ProductQuickView/ProductQuickViewModal";

interface ProductActionCardPropsType {
    product: ProductType; // Product type should be defined in your project
}
const ProductActionCard: FC<ProductActionCardPropsType> = ({ product }) => {
    const { addToCart } = useCart();
    return (
        <div className="flex gap-2 justify-center items-center">
            {/* Wishlist Button */}
            <button
                className="p-2 rounded-md bg-gray-100 hover:bg-[#02b290] hover:text-white transition"
                title="Wishlist"
            >
                <AiOutlineHeart />
            </button>

            {/* Quick View Button */}
            <ProductQuickViewModal product={product} />

            {/* Add to Cart Button */}
            <button
                className="p-2 rounded-md bg-gray-100 hover:bg-[#02b290] hover:text-white transition"
                title="Add To Cart"
                onClick={() => addToCart(product?.id, "1")}
            >
                <AiOutlineShoppingCart />
            </button>
        </div>
    );
};

export default ProductActionCard;
