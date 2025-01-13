import { SidebarProvider } from "@/seller/contexts/sidebar-context";
import { useAppDispatch, useAppSelector } from "@/seller/store";
import { clearOnboard } from "@/seller/store/slices/storeOnboardSlice";
import { Flowbite } from "flowbite-react";
import { LayoutContent } from "../layout-content";
import { DashboardNavbar } from "../navbar";
import { customTheme } from "../theme";
import { EditorSidebar } from "./sidebar";

export default function EditorLayout({
    children,
    sidebarChildren,
}: {
    children: any;
    sidebarChildren: any;
}) {
    const { sidebar } = useAppSelector((state) => state.base);
    const dispatch = useAppDispatch();
    dispatch(clearOnboard());

    return (
        <Flowbite theme={{ theme: customTheme }}>
            <SidebarProvider initialCollapsed={sidebar.desktop.isCollapsed}>
                <DashboardNavbar />
                <div className="mt-16 flex items-start">
                    <EditorSidebar>{sidebarChildren}</EditorSidebar>
                    <LayoutContent>{children}</LayoutContent>
                </div>
            </SidebarProvider>
        </Flowbite>
    );
}
