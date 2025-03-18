import { ProductType } from "@type/productType";
import { FC } from "react";

const PriceStack: FC<{ product: ProductType }> = ({ product }) => {
    return (
        <div className="mb-1 lg:mb-1.5 -mx-1">
            <span className="inline-block mx-1 text-sm font-semibold sm:text-base lg:text-lg text-gray-800">
                $ {product?.price}
            </span>

            {product?.has_discount && (
                <span className="line-through text-sm">
                    $ {product?.discount_price}
                </span>
            )}
        </div>
    );
};

export default PriceStack;
