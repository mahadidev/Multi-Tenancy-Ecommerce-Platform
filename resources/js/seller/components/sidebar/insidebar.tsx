import { useAppDispatch, useAppSelector } from "@/seller/store";
import {
    setInSidebarCollapsed,
    setInsideIsOpenMobile,
} from "@/seller/store/slices/baseSlice";
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function InSidebar({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="lg:hidden">
                <MobileSidebar>{children}</MobileSidebar>
            </div>
            <div className="hidden lg:block">
                <DesktopSidebar>{children}</DesktopSidebar>
            </div>
        </>
    );
}

function DesktopSidebar({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { isCollapsed } = useAppSelector(
        (state) => state.base.inSidebar.desktop
    );
    const { sidebar } = useAppSelector((state) => state.base);
    function setCollapsed(value: boolean) {
        dispatch(setInSidebarCollapsed(value));
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
            color="blue"
            onMouseEnter={preview.enable}
            onMouseLeave={preview.disable}
            aria-label="Sidebar with multi-level dropdown example"
            collapsed={isCollapsed}
            className={twMerge(
                "fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r border-gray-200  pt-16 duration-75 lg:flex dark:border-gray-700 ",
                isCollapsed && "hidden w-16",
                sidebar.desktop.isCollapsed ? "lg:ml-16" : "lg:ml-64"
            )}
            id="sidebar"
        >
            <div className="flex w-full h-full  flex-col justify-between">
                <div className="">{children}</div>
            </div>
        </Sidebar>
    );
}

function MobileSidebar({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { isOpenMobile: isOpen } = useAppSelector(
        (state) => state.base.inSidebar.mobile
    );
    function close() {
        dispatch(setInsideIsOpenMobile(false));
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
                    {children}
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
