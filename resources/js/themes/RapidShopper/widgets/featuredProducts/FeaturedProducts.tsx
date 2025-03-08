import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";
import { MdOutlineAddShoppingCart } from "react-icons/md";

interface Product {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
}

const featuredProducts: Product[] = [
    {
        id: 1,
        name: "Product 1",
        price: "$99.99",
        imageUrl: "https://i.ibb.co.com/Css1YR54/watch-3.webp",
    },
    {
        id: 2,
        name: "Product 2",
        price: "$79.99",
        imageUrl: "https://i.ibb.co.com/j9mTdf4Y/laptop-1.webp",
    },
    {
        id: 3,
        name: "Product 3",
        price: "$49.99",
        imageUrl: "https://i.ibb.co.com/cS5XWzsL/watch-2.webp",
    },
    {
        id: 4,
        name: "Product 4",
        price: "$59.99",
        imageUrl: "https://i.ibb.co.com/zTPTLjT6/mobile-1.webp",
    },
    {
        id: 1,
        name: "Product 1",
        price: "$99.99",
        imageUrl: "https://i.ibb.co.com/Css1YR54/watch-3.webp",
    },
    {
        id: 2,
        name: "Product 2",
        price: "$79.99",
        imageUrl: "https://i.ibb.co.com/j9mTdf4Y/laptop-1.webp",
    },
    {
        id: 3,
        name: "Product 3",
        price: "$49.99",
        imageUrl: "https://i.ibb.co.com/cS5XWzsL/watch-2.webp",
    },
    {
        id: 4,
        name: "Product 4",
        price: "$59.99",
        imageUrl: "https://i.ibb.co.com/zTPTLjT6/mobile-1.webp",
    },
];

const FeaturedProducts: FC<ThemeWidgetPropsType> = () => {
    return (
        <section className="container px-4 lg:px-0 mx-auto my-3 lg:my-7 bg-white rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Best Selling Products
            </h2>
            {/* {JSON.stringify(store?.featuredProducts, null, 2)} */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {featuredProducts?.map((product) => (
                    <div
                        key={product.id}
                        className="bg-gray-100 p-4 rounded-lg text-left"
                    >
                        <img
                            src={product?.imageUrl}
                            alt={product?.name}
                            width={150}
                            height={150}
                            className="mx-auto mb-2 rounded-lg"
                        />
                        <h3 className="text-md font-semibold text-gray-700">
                            {product?.name}
                        </h3>
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-gray-500">
                                {product?.price}
                            </p>

                            <MdOutlineAddShoppingCart
                                className="font-bold cursor-pointer hover:text-gray-500"
                                size={22}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
