import { ThemeLayoutPropsType } from "@type/themeType";
import { FC } from "react";
import { FaSearch } from "react-icons/fa";
import { HiBars3 } from "react-icons/hi2";
import { IoBagOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navigation: FC<ThemeLayoutPropsType> = ({ store }) => {
    console.log(store);
    return (
        <header className="flex justify-center">
            <div className="w-screen">
                <div className="container py-2 mx-auto flex justify-between">
                    <Link to="/">
                        <a className="w-12 sm:w-max">
                            <img
                                alt="Logo"
                                src={
                                    // store?.logo ||
                                    "https://cholgori-com-1.vercel.app/images/logo.svg"
                                }
                                width={80}
                                height={80}
                            />
                        </a>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="items-stretch mr-4 hidden sm:flex">
                            <input
                                className="px-3 py-2 bg-gray-100 border-none focus:!border-none focus:!outline-none"
                                type="text"
                                placeholder="Search..."
                            />
                            <button className="bg-[#FFC100] text-gray-800 px-3 text-lg">
                                <FaSearch />
                            </button>
                        </div>
                        <button className="text-gray-500 text-2xl sm:hidden">
                            <FaSearch />
                        </button>
                        <Link to="/cart">
                            <a className="flex text-lg font-semibold gap-3 items-center text-gray-800">
                                <span className="text-gray-500 text-2xl relative">
                                    <IoBagOutline size={22} />
                                    <span className="absolute -top-2 -right-2 bg-[#FFC100] text-gray-900 w-5 h-5 text-xs rounded-full flex items-center justify-center">
                                        0
                                    </span>
                                </span>
                                0$
                            </a>
                        </Link>
                    </div>
                </div>
                <nav className="w-full bg-white relative border-t z-30">
                    <div className="container mx-auto justify-between items-center gap-2 hidden lg:flex">
                        <div className="flex gap-4 relative ">
                            <p className="bg-[#ffc100] w-[280px] px-4 py-2 bg-primary text-gray-800 flex gap-2 items-center">
                                <HiBars3 size={25} /> Browse Categories
                            </p>
                            <div className="absolute w-[280px] bg-white h-[500px] top-[41px]  hidden lg:block pt-4">
                                {/* {store?.categories?.map(
                                    (category: CategoryType, idx: number) => (
                                        <a
                                            key={idx}
                                            className="block py-2 px-4 hover:bg-gray-100"
                                            href={category?.slug}
                                        >
                                            {category?.name}
                                        </a>
                                    )
                                )} */}

                                <a
                                    className="block py-2 px-4 hover:bg-gray-100"
                                    href="/electronic-devices"
                                >
                                    Electronic Devices
                                </a>
                                <a
                                    className="block py-2 px-4 hover:bg-gray-100"
                                    href="/electronic-devices"
                                >
                                    Electronic Devices
                                </a>
                                <a
                                    className="block py-2 px-4 hover:bg-gray-100"
                                    href="/electronic-devices"
                                >
                                    Electronic Devices
                                </a>
                                <a
                                    className="block py-2 px-4 hover:bg-gray-100"
                                    href="/electronic-devices"
                                >
                                    Electronic Devices
                                </a>
                                <a
                                    className="block py-2 px-4 hover:bg-gray-100"
                                    href="/electronic-devices"
                                >
                                    Electronic Devices
                                </a>
                                <a
                                    className="block py-2 px-4 hover:bg-gray-100"
                                    href="/electronic-devices"
                                >
                                    Electronic Devices
                                </a>
                            </div>
                            <div className="flex items-center gap-5">
                                <Link to="/">
                                    <a className="text-gray-800 py-2">Home</a>
                                </Link>
                                <Link to="/stores">
                                    <a className="text-gray-800 py-2">Stores</a>
                                </Link>
                                <Link to="/about">
                                    <a className="text-gray-800 py-2">About</a>
                                </Link>
                                <Link to="/support">
                                    <a className="text-gray-800 py-2">
                                        Support
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <div className="flex gap-4 py-2">
                            <Link to="/register-seller">
                                <a className="text-gray-800 py-2">
                                    Become a Seller
                                </a>
                            </Link>
                            <Link to="/login">
                                <a className="text-gray-800 py-2">Login</a>
                            </Link>
                        </div>
                    </div>
                </nav>{" "}
            </div>
        </header>
    );
};
export default Navigation;
