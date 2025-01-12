import { RoutePath } from "@/seller/env";
import { useAppDispatch, useAppSelector } from "@/seller/store";
import {
    setIsOpenMobile,
    setSidebarCollapsed,
} from "@/seller/store/slices/baseSlice";
import { Dropdown, Sidebar, TextInput, Tooltip } from "flowbite-react";
import type { ComponentProps, FC, HTMLAttributeAnchorTarget } from "react";
import { useEffect, useState } from "react";
import { FaPaintBrush } from "react-icons/fa";
import {
    HiAdjustments,
    HiChartPie,
    HiCog,
    HiSearch,
    HiShoppingBag,
    HiSupport,
} from "react-icons/hi";
import { MdCollectionsBookmark } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface SidebarItem {
    href?: string;
    target?: HTMLAttributeAnchorTarget;
    icon?: FC<ComponentProps<"svg">>;
    label: string;
    items?: SidebarItem[];
    badge?: string;
}

interface SidebarItemProps extends SidebarItem {
    pathname: string;
}

export function DashboardSidebar() {
    return (
        <>
            <div className="lg:hidden">
                <MobileSidebar />
            </div>
            <div className="hidden lg:block">
                <DesktopSidebar />
            </div>
        </>
    );
}

function DesktopSidebar() {
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const { isCollapsed } = useAppSelector(
        (state) => state.base.sidebar.desktop
    );
    function setCollapsed(value: boolean) {
        dispatch(setSidebarCollapsed(value));
    }
    const [isPreview, setIsPreview] = useState(isCollapsed);

    useEffect(() => {
        if (isCollapsed) setIsPreview(false);
    }, [isCollapsed]);

    const preview = {
        enable() {
            if (!isCollapsed) return;

            setIsPreview(true);
            setCollapsed(false);
        },
        disable() {
            if (!isPreview) return;

            setCollapsed(true);
        },
    };

    return (
        <Sidebar
            onMouseEnter={preview.enable}
            onMouseLeave={preview.disable}
            aria-label="Sidebar with multi-level dropdown example"
            collapsed={isCollapsed}
            className={twMerge(
                "fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r border-gray-200 pt-16 duration-75 lg:flex dark:border-gray-700",
                isCollapsed && "hidden w-16"
            )}
            id="sidebar"
        >
            <div className="flex h-full flex-col justify-between">
                <div className="py-2">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup className="mt-0 border-t-0 pb-1 pt-0">
                            {pages.map((item) => (
                                <SidebarItem
                                    key={item.label}
                                    {...item}
                                    pathname={pathname}
                                />
                            ))}
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup className="mt-2 pt-2">
                            {externalPages.map((item) => (
                                <SidebarItem
                                    key={item.label}
                                    {...item}
                                    pathname={pathname}
                                />
                            ))}
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </div>
                <BottomMenu isCollapsed={isCollapsed} />
            </div>
        </Sidebar>
    );
}

function MobileSidebar() {
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const { isOpenMobile: isOpen } = useAppSelector(
        (state) => state.base.sidebar.mobile
    );
    function close() {
        dispatch(setIsOpenMobile(false));
    }

    if (!isOpen) return null;

    return (
        <>
            <Sidebar
                aria-label="Sidebar with multi-level dropdown example"
                className={twMerge(
                    "fixed inset-y-0 left-0 z-20 hidden h-full shrink-0 flex-col border-r border-gray-200 pt-16 lg:flex dark:border-gray-700",
                    isOpen && "flex"
                )}
                id="sidebar"
            >
                <div className="flex h-full flex-col justify-between">
                    <div className="py-2">
                        <form className="pb-3">
                            <TextInput
                                icon={HiSearch}
                                type="search"
                                placeholder="Search"
                                required
                                size={32}
                            />
                        </form>
                        <Sidebar.Items>
                            <Sidebar.ItemGroup className="mt-0 border-t-0 pb-1 pt-0">
                                {pages.map((item) => (
                                    <SidebarItem
                                        key={item.label}
                                        {...item}
                                        pathname={pathname}
                                    />
                                ))}
                            </Sidebar.ItemGroup>
                            <Sidebar.ItemGroup className="mt-2 pt-2">
                                {externalPages.map((item) => (
                                    <SidebarItem
                                        key={item.label}
                                        {...item}
                                        pathname={pathname}
                                    />
                                ))}
                            </Sidebar.ItemGroup>
                        </Sidebar.Items>
                    </div>
                    <BottomMenu isCollapsed={false} />
                </div>
            </Sidebar>
            <div
                onClick={close}
                aria-hidden="true"
                className="fixed inset-0 z-10 h-full w-full bg-gray-900/50 pt-16 dark:bg-gray-900/90"
            />
        </>
    );
}

function SidebarItem({
    href,
    target,
    icon,
    label,
    items,
    badge,
    pathname,
}: SidebarItemProps) {
    if (items) {
        const isOpen = items.some((item) =>
            pathname.startsWith(item.href ?? "")
        );

        return (
            <Sidebar.Collapse
                icon={icon}
                label={label}
                open={isOpen}
                theme={{ list: "space-y-2 py-2  [&>li>div]:w-full" }}
            >
                {items.map((item) => (
                    <Sidebar.Item
                        key={item.label}
                        as={Link}
                        to={item.href}
                        target={item.target}
                        className={twMerge(
                            "justify-center [&>*]:font-normal",
                            pathname === item.href &&
                                "bg-gray-100 dark:bg-gray-700"
                        )}
                    >
                        {item.label}
                    </Sidebar.Item>
                ))}
            </Sidebar.Collapse>
        );
    }

    return (
        <Sidebar.Item
            as={Link}
            to={href}
            target={target}
            icon={icon}
            label={badge}
            className={twMerge(
                pathname === href && "bg-gray-100 dark:bg-gray-700"
            )}
        >
            {label}
        </Sidebar.Item>
    );
}

function BottomMenu({ isCollapsed }: { isCollapsed: boolean }) {
    return (
        <div
            className={twMerge(
                "flex items-center justify-center gap-4",
                isCollapsed && "flex-col"
            )}
        >
            <button className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white">
                <span className="sr-only">Tweaks</span>
                <HiAdjustments className="h-6 w-6" />
            </button>
            <Tooltip content="Settings page">
                <Link
                    to="/users/settings"
                    className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <span className="sr-only">Settings page</span>
                    <HiCog className="h-6 w-6" />
                </Link>
            </Tooltip>
            <div>
                <LanguageDropdown />
            </div>
        </div>
    );
}

function LanguageDropdown() {
    return (
        <Dropdown
            arrowIcon={false}
            inline
            label={
                <span className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Current language</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 3900 3900"
                        className="h-5 w-5 rounded-full"
                    >
                        <path fill="#b22234" d="M0 0h7410v3900H0z" />
                        <path
                            d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
                            stroke="#fff"
                            strokeWidth="300"
                        />
                        <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
                        <g fill="#fff">
                            <g id="d">
                                <g id="c">
                                    <g id="e">
                                        <g id="b">
                                            <path
                                                id="a"
                                                d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
                                            />
                                            <use xlinkHref="#a" y="420" />
                                            <use xlinkHref="#a" y="840" />
                                            <use xlinkHref="#a" y="1260" />
                                        </g>
                                        <use xlinkHref="#a" y="1680" />
                                    </g>
                                    <use xlinkHref="#b" x="247" y="210" />
                                </g>
                                <use xlinkHref="#c" x="494" />
                            </g>
                            <use xlinkHref="#d" x="988" />
                            <use xlinkHref="#c" x="1976" />
                            <use xlinkHref="#e" x="2470" />
                        </g>
                    </svg>
                </span>
            }
        >
            <ul className="py-1" role="none">
                <li>
                    <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <div className="inline-flex items-center">
                            <svg
                                className="mr-2 h-4 w-4 rounded-full"
                                xmlns="http://www.w3.org/2000/svg"
                                id="flag-icon-css-us"
                                viewBox="0 0 512 512"
                            >
                                <g fillRule="evenodd">
                                    <g strokeWidth="1pt">
                                        <path
                                            fill="#bd3d44"
                                            d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                                            transform="scale(3.9385)"
                                        />
                                        <path
                                            fill="#fff"
                                            d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                                            transform="scale(3.9385)"
                                        />
                                    </g>
                                    <path
                                        fill="#192f5d"
                                        d="M0 0h98.8v70H0z"
                                        transform="scale(3.9385)"
                                    />
                                    <path
                                        fill="#fff"
                                        d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
                                        transform="scale(3.9385)"
                                    />
                                </g>
                            </svg>
                            <span className="whitespace-nowrap">
                                English (US)
                            </span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <div className="inline-flex items-center">
                            <svg
                                className="mr-2 h-4 w-4 rounded-full"
                                xmlns="http://www.w3.org/2000/svg"
                                id="flag-icon-css-de"
                                viewBox="0 0 512 512"
                            >
                                <path fill="#ffce00" d="M0 341.3h512V512H0z" />
                                <path d="M0 0h512v170.7H0z" />
                                <path fill="#d00" d="M0 170.7h512v170.6H0z" />
                            </svg>
                            Deutsch
                        </div>
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <div className="inline-flex items-center">
                            <svg
                                className="mr-2 h-4 w-4 rounded-full"
                                xmlns="http://www.w3.org/2000/svg"
                                id="flag-icon-css-it"
                                viewBox="0 0 512 512"
                            >
                                <g fillRule="evenodd" strokeWidth="1pt">
                                    <path fill="#fff" d="M0 0h512v512H0z" />
                                    <path
                                        fill="#009246"
                                        d="M0 0h170.7v512H0z"
                                    />
                                    <path
                                        fill="#ce2b37"
                                        d="M341.3 0H512v512H341.3z"
                                    />
                                </g>
                            </svg>
                            Italiano
                        </div>
                    </Link>
                </li>
                <li>
                    <Link
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <div className="inline-flex items-center">
                            <svg
                                className="mr-2 h-4 w-4 rounded-full"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                id="flag-icon-css-cn"
                                viewBox="0 0 512 512"
                            >
                                <defs>
                                    <path
                                        id="a"
                                        fill="#ffde00"
                                        d="M1-.3L-.7.8 0-1 .6.8-1-.3z"
                                    />
                                </defs>
                                <path fill="#de2910" d="M0 0h512v512H0z" />
                                <use
                                    width="30"
                                    height="20"
                                    transform="matrix(76.8 0 0 76.8 128 128)"
                                    xlinkHref="#a"
                                />
                                <use
                                    width="30"
                                    height="20"
                                    transform="rotate(-121 142.6 -47) scale(25.5827)"
                                    xlinkHref="#a"
                                />
                                <use
                                    width="30"
                                    height="20"
                                    transform="rotate(-98.1 198 -82) scale(25.6)"
                                    xlinkHref="#a"
                                />
                                <use
                                    width="30"
                                    height="20"
                                    transform="rotate(-74 272.4 -114) scale(25.6137)"
                                    xlinkHref="#a"
                                />
                                <use
                                    width="30"
                                    height="20"
                                    transform="matrix(16 -19.968 19.968 16 256 230.4)"
                                    xlinkHref="#a"
                                />
                            </svg>
                            <span className="whitespace-nowrap">
                                中文 (繁體)
                            </span>
                        </div>
                    </Link>
                </li>
            </ul>
        </Dropdown>
    );
}

const pages: SidebarItem[] = [
    { href: "/", icon: HiChartPie, label: "Dashboard" },
    // { href: "/kanban", icon: HiViewGrid, label: "Kanban" },
    // { href: "/mailing/inbox", icon: HiInboxIn, label: "Inbox", badge: "3" },
    {
        icon: HiShoppingBag,
        label: "E-commerce",
        items: [
            { href: RoutePath.products, label: "Products" },
            // { href: "/e-commerce/billing", label: "Billing" },
            // { href: "/e-commerce/invoice", label: "Invoice" },
        ],
    },
    // {
    //     icon: HiUsers,
    //     label: "Users",
    //     items: [
    //         { href: "/users/list", label: "Users list" },
    //         { href: "/users/profile", label: "Profile" },
    //         { href: "/users/feed", label: "Feed" },
    //         { href: "/users/settings", label: "Settings" },
    //     ],
    // },
    // {
    //     icon: HiDocumentReport,
    //     label: "Pages",
    //     items: [
    //         { href: "/pages/pricing", label: "Pricing" },
    //         { href: "/pages/maintenance", label: "Maintenace" },
    //         { href: "/pages/404", label: "404 not found" },
    //         { href: "/pages/500", label: "500 server error" },
    //     ],
    // },
    // {
    //     icon: HiLockClosed,
    //     label: "Authentication",
    //     items: [
    //         { href: "/authentication/sign-in", label: "Sign in" },
    //         { href: "/authentication/sign-up", label: "Sign up" },
    //         {
    //             href: "/authentication/forgot-password",
    //             label: "Forgot password",
    //         },
    //         { href: "/authentication/reset-password", label: "Reset password" },
    //         { href: "/authentication/profile-lock", label: "Profile lock" },
    //     ],
    // },
];

const externalPages: SidebarItem[] = [
    {
        href: RoutePath.pages.list(),
        icon: MdCollectionsBookmark,
        label: "Pages",
    },
    {
        icon: FaPaintBrush,
        label: "Appearance",
        items: [
            { href: RoutePath.themes.list(), label: "Themes" },
            // { href: "/e-commerce/billing", label: "Billing" },
            // { href: "/e-commerce/invoice", label: "Invoice" },
        ],
    },
    {
        href: RoutePath.settings,
        icon: HiCog,
        label: "Settings",
    },
    {
        href: "https://github.com/themesberg/flowbite-react/issues",
        target: "_blank",
        icon: HiSupport,
        label: "Help",
    },
];
