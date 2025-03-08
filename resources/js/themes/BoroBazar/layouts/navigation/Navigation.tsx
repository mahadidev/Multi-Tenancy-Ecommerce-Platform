import { MenuItemType, MenuType } from "@type/menuType";
import { ThemeLayoutPropsType } from "@type/themeType";
import { Dropdown, Navbar } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { FaGlobe, FaRegUserCircle } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdClose } from "react-icons/md";

const Navigation: FC<ThemeLayoutPropsType> = ({ store }) => {
    const [timeLeft, setTimeLeft] = useState(6 * 3600 + 13 * 60 + 6); // 6:13:06 in seconds
    const [showBanner, setShowBanner] = useState(true);

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
                    className={`bg-[#02B290] text-white text-sm p-2 relative w-full px-4 md:px-12`}
                >
                    {" "}
                    <div className="md:w-11/12 w-full mx-auto flex items-center justify-center">
                        <span className="flex justify-center items-center gap-2 text-center text-xs md:text-sm font-semibold">
                            📦 Claim your online <strong>FREE Delivery</strong>{" "}
                            or Shipping today! Expires in
                            <div className="flex gap-3 items-center">
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
                        </span>
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
                <Navbar className="!w-full py-4">
                    <Navbar.Brand href="#" className="flex items-center gap-2">
                        <img src={store?.logo} alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Collapse className="w-full flex flex-col md:flex-row md:items-center">
                        {store?.menus?.map((menu: MenuType, idx: number) => (
                            <>
                                {menu?.items?.length ? (
                                    <Dropdown
                                        key={idx}
                                        label={menu?.label}
                                        inline
                                    >
                                        {menu?.items?.map(
                                            (
                                                item: MenuItemType,
                                                idx: number
                                            ) => (
                                                <a href={item?.href} key={idx}>
                                                    <Dropdown.Item>
                                                        {item?.label}
                                                    </Dropdown.Item>
                                                </a>
                                            )
                                        )}
                                    </Dropdown>
                                ) : (
                                    <a
                                        key={idx}
                                        href={`/sites/${store?.slug}/${menu?.name}`}
                                    >
                                        {menu?.label}
                                    </a>
                                )}
                            </>
                        ))}
                    </Navbar.Collapse>{" "}
                    <div className="flex md:order-2 items-center gap-4">
                        <FaRegUserCircle className="text-xl" />
                        <HiOutlineShoppingBag className="text-2xl cursor-pointer" />
                        <Dropdown
                            label={<FaGlobe className="text-xl" />}
                            inline
                        >
                            <Dropdown.Item>English - EN</Dropdown.Item>
                            <Dropdown.Item>Español - ES</Dropdown.Item>
                        </Dropdown>
                        <Navbar.Toggle />
                    </div>
                </Navbar>
            </div>
        </header>
    );
};
export default Navigation;
export const primary_color = "#02B290";
