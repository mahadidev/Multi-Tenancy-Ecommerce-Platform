import { GLOBAL_APP_URL } from "@helper/global_env";
import useStore from "@seller/hooks/useStore";
import {
    setIsOpenMobile,
    setSidebarCollapsed,
} from "@seller/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@seller/store/store";
import { SidebarItemType } from "@type/sidebarType";
import { Button, Sidebar, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useMode } from "./Mode/Mode";

interface SidebarItemProps extends SidebarItemType {
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
    const { isCollapsed } = useAppSelector((state) => state.ui.sidebar.desktop);
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
    }
    const { pages, externalPages } = useMode('e-commerce');
    return (
        <Sidebar
            onMouseEnter={preview.enable}
            onMouseLeave={preview.disable}
            aria-label="Sidebar with multi-level dropdown example"
            collapsed={isCollapsed}
            className={twMerge(
                "fixed inset-y-0 left-0 z-40 flex h-full shrink-0 flex-col border-r border-gray-200 pt-16 duration-75 lg:flex dark:border-gray-700",
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
                            ))}{" "}
                            <br />{" "}
                            <SidebarItem
                                key={"subscription_plan"}
                                {...{
                                    href: "select-subscriptions?action=upgrade",
                                    label: "Upgrade Plan",
                                }}
                                pathname={pathname}
                            />
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
        (state) => state.ui.sidebar.mobile
    );
    function close() {
        dispatch(setIsOpenMobile(false));
    }
    const { pages, externalPages } = useMode('e-commerce');
    if (!isOpen) return null;
    return (
        <>
            <Sidebar
                aria-label="Sidebar with multi-level dropdown example"
                className={twMerge(
                    "fixed inset-y-0 left-0 z-40 hidden h-full shrink-0 flex-col border-r border-gray-200 pt-16 lg:flex dark:border-gray-700",
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
                className="fixed inset-0 z-30 h-full w-full bg-gray-900/50 pt-16 dark:bg-gray-900/90"
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
                href === "/select-subscriptions" &&
                    "bg-blue-600 dark:text-white",
                pathname === href && "bg-gray-100 dark:bg-gray-700"
            )}
        >
            {label}
        </Sidebar.Item>
    );
}

function BottomMenu({ isCollapsed }: { isCollapsed: boolean }) {
    const { store } = useStore();

    return (
        <div
            className={twMerge(
                "flex items-center justify-center gap-4",
                isCollapsed && "flex-col"
            )}
        >
            {store && (
                <Button
                    color="primary"
                    as="a"
                    href={`${GLOBAL_APP_URL}/sites/${store.slug}`}
                    target="_blank"
                >
                    Visit Site
                </Button>
            )}
        </div>
    );
}
