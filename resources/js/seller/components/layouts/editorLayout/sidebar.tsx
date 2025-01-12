import { useAppDispatch, useAppSelector } from "@/seller/store";
import { setSidebarCollapsed } from "@/seller/store/slices/baseSlice";
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function EditorSidebar({ children }: { children: any }) {
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
                isCollapsed && "hidden lg:hidden"
            )}
            id="sidebar"
        >
            <div className="flex h-full flex-col justify-between">
                <div className="py-2">{children}</div>
            </div>
        </Sidebar>
    );
}
