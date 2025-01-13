import { RoutePath } from "@/seller/env";
import { useAppDispatch, useAppSelector } from "@/seller/store";
import {
    setIsOpenMobile,
    setSidebarCollapsed,
} from "@/seller/store/slices/baseSlice";
import { Sidebar, TextInput, Tooltip } from "flowbite-react";
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
            <Link
                to={RoutePath.pricing.index()}
                className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
            >
                <span className="sr-only">Tweaks</span>
                <HiAdjustments className="h-6 w-6" />
            </Link>
            <Tooltip content="Settings page">
                <Link
                    to={RoutePath.settings}
                    className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <span className="sr-only">Settings page</span>
                    <HiCog className="h-6 w-6" />
                </Link>
            </Tooltip>
        </div>
    );
}

const pages: SidebarItem[] = [
    { href: RoutePath.dashboard, icon: HiChartPie, label: "Dashboard" },
    {
        icon: HiShoppingBag,
        label: "E-commerce",
        items: [
            { href: RoutePath.products, label: "Products" },
            // { href: "/e-commerce/billing", label: "Billing" },
            // { href: "/e-commerce/invoice", label: "Invoice" },
        ],
    },
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
        href: RoutePath.help.index(),
        icon: HiSupport,
        label: "Help",
    },
];
