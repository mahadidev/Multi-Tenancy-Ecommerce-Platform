import { BASE_IMAGE_URL } from "@/env";
import { RoutePath } from "@/seller/env";
import { DarkThemeToggle, Tooltip } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
    AppDrawerDropdown,
    NotificationBellDropdown,
    UserDropdown,
} from "./navbar";

export function LandingNavbar() {
    return (
        <nav className="fixed z-50 w-full border-b border-gray-200 bg-white sm:py-2 dark:border-gray-700 dark:bg-gray-800">
            <div className="px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Link to={RoutePath.dashboard} className="mr-4 flex">
                            <img
                                alt=""
                                src={`${BASE_IMAGE_URL}/logos/logo-black.png`}
                                width={43}
                                height={44}
                                className="mr-4 h-11 w-auto dark:hidden"
                            />
                            <img
                                alt=""
                                src={`${BASE_IMAGE_URL}/logos/logo-white.png`}
                                width={43}
                                height={44}
                                className="mr-4 h-11 w-auto hidden dark:block"
                            />
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex">
                            <ul className="flex space-x-8">
                                <li>
                                    <Link
                                        to={RoutePath.dashboard}
                                        className="text-sm font-medium text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-500"
                                        aria-current="page"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={RoutePath.settings}
                                        className="text-sm font-medium text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-500"
                                        aria-current="page"
                                    >
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={RoutePath.themes.list()}
                                        className="text-sm font-medium text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-500"
                                        aria-current="page"
                                    >
                                        Theme
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={RoutePath.help.index()}
                                        className="text-sm font-medium text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-500"
                                        aria-current="page"
                                    >
                                        Help
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center lg:gap-3">
                        <div className="flex items-center">
                            <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700">
                                <span className="sr-only">Search</span>
                                <HiSearch className="h-6 w-6" />
                            </button>
                            <NotificationBellDropdown />
                            <AppDrawerDropdown />
                            <div className="hidden dark:block">
                                <Tooltip content="Toggle light mode">
                                    <DarkThemeToggle />
                                </Tooltip>
                            </div>
                            <div className="dark:hidden">
                                <Tooltip content="Toggle dark mode">
                                    <DarkThemeToggle />
                                </Tooltip>
                            </div>
                            <div className="ml-3 flex items-center">
                                <UserDropdown />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden sm:hidden" id="mobile-menu">
                <ul className="pt-2">
                    <li>
                        <a
                            href="#"
                            className="block bg-gray-100 py-2 pl-3 pr-4 text-base font-normal text-gray-900 dark:bg-gray-700 dark:text-white"
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block border-b border-gray-100 px-3 py-2 text-base font-normal text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Team
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block border-b border-gray-100 px-3 py-2 text-base font-normal text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Projects
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block border-b border-gray-100 px-3 py-2 text-base font-normal text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Calendar
                        </a>
                    </li>
                    <li className="block">
                        <a
                            href="#"
                            className="inline-flex w-full items-center px-3 py-2 text-base font-normal text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <svg
                                className="mr-2 h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                            </svg>
                            Login/Register
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
