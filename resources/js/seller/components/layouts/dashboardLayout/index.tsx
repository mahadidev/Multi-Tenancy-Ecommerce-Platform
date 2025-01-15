import { SidebarProvider } from "@/seller/contexts/sidebar-context";
import { useAppDispatch, useAppSelector } from "@/seller/store";
import { clearOnboard } from "@/seller/store/slices/storeOnboardSlice";
import { Flowbite } from "flowbite-react";
import { Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { customTheme } from "../theme";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout() {
    const { sidebar } = useAppSelector((state) => state.base);
    const dispatch = useAppDispatch();
    dispatch(clearOnboard());

    return (
        <Flowbite theme={{ theme: customTheme }}>
            <SidebarProvider initialCollapsed={sidebar.desktop.isCollapsed}>
                <DashboardNavbar />
                <div className="mt-16 flex items-start">
                    <DashboardSidebar />
                    <div
                        id="main-content"
                        className={twMerge(
                            "relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900",
                            sidebar.desktop.isCollapsed
                                ? "lg:ml-16"
                                : "lg:ml-64"
                        )}
                    >
                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
        </Flowbite>
    );
}
