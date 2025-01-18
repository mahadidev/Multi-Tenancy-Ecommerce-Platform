import { InSidebar } from "@/seller/components";
import { InSidebarProvider } from "@/seller/contexts/insidebar-content";
import useBase from "@/seller/hooks/useBase";
import usePage from "@/seller/hooks/usePage";
import { useFetchPageQuery } from "@/seller/store/reducers/pageApi";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import PageContent from "./pageContent";
import PageEditor from "./pageEditor";
import WidgetEditor from "./widgetEditor";
import WidgetModal from "./widgetModal";

const PageEditPage = () => {
    const { pageId, store, setPage, widget } = usePage();
    const { data: pageResponse } = useFetchPageQuery({
        pageId: pageId ?? 0,
        storeId: store.id,
    });
    // set page
    useEffect(() => {
        if (pageResponse) {
            setPage(pageResponse.data.page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageResponse]);

    // coolapsed desktop sidebar on enter this page
    const { setSidebarCollapsed, setInSidebarCollapsed, inSidebar } = useBase();
    useEffect(() => {
        setSidebarCollapsed(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // open mobile sidebar on select widget
    useEffect(() => {
        if (widget) {
            setInSidebarCollapsed(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <WidgetModal />
                </div>
            </div>
        </InSidebarProvider>
    );
};

export default PageEditPage;
