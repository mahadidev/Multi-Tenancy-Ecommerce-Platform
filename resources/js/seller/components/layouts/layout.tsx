import { SidebarProvider } from "@/seller/contexts/sidebar-context";
import { useAppSelector } from "@/seller/store";
import { useFetchStoresQuery } from "@/seller/store/reducers/storeApi";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { LayoutContent } from "./layout-content";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout() {
    const { sidebar } = useAppSelector((state) => state.base);
    const { data: stores, isLoading } = useFetchStoresQuery();

    useEffect(() => {
        if (stores) {
            console.log(stores);
        }
    }, [isLoading, stores]);

    return (
        <SidebarProvider initialCollapsed={sidebar.desktop.isCollapsed}>
            <DashboardNavbar />
            <div className="mt-16 flex items-start">
                <DashboardSidebar />
                <LayoutContent>
                    <Outlet />
                </LayoutContent>
            </div>
        </SidebarProvider>
    );
}
