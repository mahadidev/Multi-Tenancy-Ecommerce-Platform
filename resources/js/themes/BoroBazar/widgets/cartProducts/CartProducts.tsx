import { ThemeWidgetPropsType } from "@type/themeType";
import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import CartTableBody from "../../components/Cart/CartTableBody";
import useCart from "../../hooks/useCart";

const CartProducts: FC<ThemeWidgetPropsType> = () => {
    const { cartItems, fetchCartItems } = useCart();
    // console.log();

    useEffect(() => {
        fetchCartItems();
    }, []);

    // calculate total cart amount here
    let total_amount = 0;
    if (cartItems) {
    }

    return (
        <div className="w-full container px-4 lg:px-0 mx-auto my-20 shadow-sm py-2">
            <div className="w-full text-center">
                <div className="py-2 font-semibold text-black3 grid grid-cols-6 border border-slate-200">
                    <div className="table_head_item">Image</div>
                    <div className="table_head_item">Title</div>
                    <div className="table_head_item">Price</div>
                    <div className="table_head_item">Quantity</div>
                    <div className="table_head_item">Subtotal</div>
                    <div className="table_head_item">Remove</div>
                </div>
                {cartItems?.map((item, idx) => (
                    <CartTableBody key={idx} cartProduct={item} />
                ))}

                <div className="my-20 shadow-sm rounded-md p-2 !text-left">
                    <div className="text-xl font-semibold text-black2 tracking-wide">
                        Cart Totals
                    </div>
                    <div className="mt-5">
                        <div className="table_checkout">
                            <div className="rid grid-cols-2 border border-slate-200">
                                <div className="p-2 font-semibold text-black2">
                                    Subtotal
                                </div>
                                <div className="border border-l-slate-200 border-transparent p-2 text-black3">
                                    ৳ {total_amount.toFixed(2)}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 border border-slate-200">
                                <div className="p-2 font-semibold text-black2">
                                    Shipping
                                </div>
                                <div className="border border-l-slate-200 border-transparent p-2 text-black3">
                                    <h1 className="my-2">
                                        ৳{" "}
                                        {((total_amount / 100) * 3).toFixed(2)}
                                    </h1>
                                    <button className="text-info_color tracking-wide">
                                        Address
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 border border-slate-200">
                                <div className="p-2 font-semibold text-black2">
                                    Total
                                </div>
                                <div className="border border-l-slate-200 border-transparent p-2 text-black3">
                                    <h1 className="my-2 font-semibold tracking-wider">
                                        ৳{" "}
                                        {(
                                            total_amount +
                                            (total_amount / 100) * 3
                                        ).toFixed(2)}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-5 grid-rows-1 md:grid-cols-2 sm:grid-cols-1 gap-10">
                        <div className="checkout_btn ml-auto !mt-0 !w-full">
                            <Link to="/checkout">
                                <button
                                    id="cart_btn"
                                    className="!rounded-sm !ml-0 !py-1 !w-full"
                                >
                                    PROCEED TO CHECKOUT
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartProducts;
