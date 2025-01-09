import { SidebarProvider } from "@/seller/contexts/sidebar-context";
import { useAppDispatch, useAppSelector } from "@/seller/store";
import { clearOnboard } from "@/seller/store/slices/storeOnboardSlice";
import { Flowbite } from "flowbite-react";
import { Outlet } from "react-router-dom";
import { LayoutContent } from "./layout-content";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";
import { customTheme } from "./theme";

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
                    <LayoutContent>
                        <Outlet />
                    </LayoutContent>
                </div>
            </SidebarProvider>
        </Flowbite>
    );
}
