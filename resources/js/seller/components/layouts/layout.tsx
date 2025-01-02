import { SidebarProvider } from "@/seller/contexts/sidebar-context";
import { useAppSelector } from "@/seller/store";
import type { PropsWithChildren } from "react";
import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutContent } from "./layout-content";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout({ children }: PropsWithChildren) {
    const { sidebar } = useAppSelector((state) => state.base);

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
