import { SidebarProvider } from "@/seller/contexts/sidebar-context";
import { RoutePath } from "@/seller/env";
import { useAppSelector } from "@/seller/store";
import { useFetchStoresQuery } from "@/seller/store/reducers/storeApi";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutContent } from "./layout-content";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout() {
    const { sidebar } = useAppSelector((state) => state.base);
    const { data: response, isLoading } = useFetchStoresQuery();

    const navigate = useNavigate();

    useEffect(() => {
        if (response) {
            if (response.data.stores.length === 0) {
                navigate(RoutePath.storeCreate);
            }
        }
    }, [isLoading, navigate, response]);

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
