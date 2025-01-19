/* eslint-disable react-hooks/exhaustive-deps */
import { InSidebar } from "@/seller/components";
import { InSidebarProvider } from "@/seller/contexts/insidebar-content";
import useBase from "@/seller/hooks/useBase";
import usePage from "@/seller/hooks/usePage";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import AddWidgetModal from "./addWidgetModal";
import PageContent from "./pageContent";
import PageEditor from "./pageEditor";
import WidgetEditor from "./widgetEditor";

const PageEditPage = () => {
    const { widget } = usePage();

    // coolapsed desktop sidebar on enter this page
    const { setSidebarCollapsed, setInSidebarCollapsed, inSidebar } = useBase();
    useEffect(() => {
        setSidebarCollapsed(false);
    }, []);
    // open mobile sidebar on select widget
    useEffect(() => {
        if (widget) {
            setInSidebarCollapsed(true);
        }
    }, [widget]);

    return (
        <InSidebarProvider initialCollapsed={true}>
            <div className="w-full flex items-start">
                <InSidebar>
                    <WidgetEditor />
                    <PageEditor />
                </InSidebar>
                <div
                    id="main-content"
                    className={twMerge(
                        "w-full",
                        inSidebar.desktop.isCollapsed ? "lg:ml-16" : "lg:ml-64"
                    )}
                >
                    <PageContent />
                    <AddWidgetModal />
                </div>
            </div>
        </InSidebarProvider>
    );
};

export default PageEditPage;
