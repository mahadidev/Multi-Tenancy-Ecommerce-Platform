import { ThemeWidgetPropsType } from "@type/themeType";
import { Button } from "flowbite-react";
import { FC, useEffect } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import CartTableBody from "../../components/Cart/CartTableBody";
import useCart from "../../hooks/useCart";

const MyOrders: FC<ThemeWidgetPropsType> = () => {
    const { cartItems, isLoading, fetchCartItems } = useCart();

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <div>
            <div className="container w-8/12 mx-auto">
                {isLoading ? (
                    <div className="animate-pulse p-4 space-y-4">
                        <div className="space-y-2">
                            {new Array(5).fill(5).map((_, idx: number) => (
                                <div
                                    key={idx}
                                    className="h-20 w-full bg-gray-300 rounded"
                                ></div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {cartItems?.length ? (
                            <div className="relative">
                                <table className="w-full border-collapse border border-gray-200 rounded-md">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-2 border">
                                                Product
                                            </th>
                                            <th className="p-2 border">
                                                Price
                                            </th>
                                            <th className="p-2 border text-center">
                                                Quantity
                                            </th>
                                            <th className="p-2 border text-center">
                                                Status
                                            </th>
                                            <th className="p-2 border">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems?.map((item, idx: number) => (
                                            <CartTableBody
                                                key={idx}
                                                cartProduct={item as any}
                                            />
                                        ))}
                                    </tbody>
                                </table>

                                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 font-bold text-lg flex justify-between rounded-lg">
                                    <span className="text-black dark:text-white">
                                        Cart Total Amount
                                    </span>
                                    <span className="text-black dark:text-green-400">
                                        {cartItems
                                            .reduce(
                                                (sum, item) => sum + item.total,
                                                0
                                            )
                                            .toFixed(2)}{" "}
                                        BDT
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center">
                                <h2 className="text-2xl my-3 font-semibold">
                                    Your cart is empty.
                                </h2>
                                <Link to="/shop" className="text-center">
                                    <Button color="dark">
                                        <div className="flex items-center gap-3">
                                            Add item in cart{" "}
                                            <AiOutlineShoppingCart />
                                        </div>
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
