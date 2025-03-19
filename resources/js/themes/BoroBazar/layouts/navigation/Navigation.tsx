import { MenuItemType, MenuType } from "@type/menuType";
import { ThemeLayoutPropsType } from "@type/themeType";
import { Navbar } from "flowbite-react";
import { useAtom } from "jotai";
import { FC, useEffect, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { CategoriesPopover } from "../../components/CategoriesPopover/CategoriesPopover";
import useCart from "../../hooks/useCart";
import { cartAtom } from "../../store/cart.atom";

const Navigation: FC<ThemeLayoutPropsType> = ({ store }) => {
    const [timeLeft, setTimeLeft] = useState(6 * 3600 + 13 * 60 + 6); // 6:13:06 in seconds
    const [showBanner, setShowBanner] = useState(true);
    const [cartItems] = useAtom(cartAtom);
    const { fetchCartItems } = useCart();

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (time: any) => {
        const hours = String(Math.floor(time / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");
        return { hours, minutes, seconds };
    };

    return (
        <header className="px-0 md:px-0 w-full">
            {showBanner && (
                <div
                    className={`bg-[#02B290] hidden md:block text-white text-sm p-2 relative w-full px-4 md:px-12`}
                >
                    {" "}
                    <div className="md:w-11/12 w-full mx-auto md:flex items-center justify-center">
                        <div className="grid md:flex justify-center items-center gap-2 text-center text-xs md:text-sm font-semibold">
                            <div>
                                📦 Claim your online{" "}
                                <strong>FREE Delivery</strong> or Shipping
                                today! Expires in
                            </div>
                            <div className="flex gap-3 justify-center items-center">
                                {" "}
                                <span className="bg-white text-black px-2 py-1 rounded">
                                    {formatTime(timeLeft).hours}
                                </span>
                                <span className="bg-white text-black px-2 py-1 rounded">
                                    {formatTime(timeLeft).minutes}
                                </span>
                                <span className="bg-white text-black px-2 py-1 rounded">
                                    {formatTime(timeLeft).seconds}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowBanner(false)}
                            className="absolute right-4"
                        >
                            <MdClose className="text-xl" />
                        </button>
                    </div>
                </div>
            )}
            <div className="bg-white md:w-11/12 w-full flex items-center justify-between mx-auto">
                <Navbar className="!bg-white !w-full py-6">
                    <Navbar.Brand href="#" className="flex items-center gap-2">
                        <img src={store?.logo} alt="logo" />
                    </Navbar.Brand>

                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        <Link to="/cart" className="relative">
                            <button
                                className="flex items-center justify-center shrink-0 h-auto focus:outline-none transform lg:flex"
                                aria-label="cart-button"
                            >
                                <div className="relative flex items-center">
                                    <HiOutlineShoppingBag className="text-2xl cursor-pointer" />{" "}
                                    <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-white absolute -top-4 left-2.5 right-2.5 text-[10px] font-bold bg-[#02B290]">
                                        {cartItems.reduce(
                                            (sum, item) => sum + item.qty,
                                            0
                                        )}
                                    </span>
                                </div>
                                <span className="font-semibold ml-1">Cart</span>
                            </button>
                        </Link>

                        {store?.menus?.map((menu: MenuType) => (
                            <>
                                {/* {menu?.name === "user" && (
                                    <>
                                        {menu?.items?.map(
                                            (
                                                item: MenuItemType,
                                                idx: number
                                            ) => (
                                                <a key={idx} href={item?.href}>
                                                    {item?.label}
                                                </a>
                                            )
                                        )}
                                    </>
                                )} */}
                                {menu?.name === "guest" && (
                                    <>
                                        {menu?.items?.map(
                                            (
                                                item: MenuItemType,
                                                idx: number
                                            ) => (
                                                <a
                                                    className="font-semibold"
                                                    key={idx}
                                                    href={item?.href}
                                                >
                                                    {item?.label}
                                                </a>
                                            )
                                        )}
                                    </>
                                )}
                            </>
                        ))}
                        <Navbar.Toggle />
                    </div>
                </Navbar>
            </div>
            <div className="my-3 border">
                <Navbar>
                    <CategoriesPopover
                        categories={store?.categories}
                        storeSlug={store?.slug}
                    />
                    <Navbar.Collapse className="w-full flex flex-col md:flex-row md:items-center gap-2">
                        {store?.menus?.map((menu: MenuType) => (
                            <>
                                {menu?.name === "main" && (
                                    <>
                                        {menu?.items?.map(
                                            (
                                                item: MenuItemType,
                                                idx: number
                                            ) => (
                                                <a key={idx} href={item?.href}>
                                                    {item?.label}
                                                </a>
                                            )
                                        )}
                                    </>
                                )}
                            </>
                        ))}
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </header>
    );
};
export default Navigation;
export const primary_color = "#02B290";
