import { InSidebar } from "@/seller/components";
import { InSidebarProvider } from "@/seller/contexts/insidebar-content";
import useBase from "@/seller/hooks/useBase";
import usePage from "@/seller/hooks/usePage";
import { useFetchPageQuery } from "@/seller/store/reducers/pageApi";
import { StorePageType, WidgetType } from "@/seller/types";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import PageContent from "./pageContent";
import PageEditor from "./pageEditor";
import WidgetEditor from "./widgetEditor";
import WidgetModal from "./widgetModal";

const PageEditPage = () => {
    const { pageId, store } = usePage();
    const { data: pageResponse } = useFetchPageQuery({
        pageId: pageId ?? 0,
        storeId: store.id,
    });

    // coolapsed desktop sidebar on enter this page
    const { setSidebarCollapsed, setInSidebarCollapsed, inSidebar } = useBase();
    useEffect(() => {
        setSidebarCollapsed(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // set page data
    const [pageData, setPageData] = useState<StorePageType>();
    useEffect(() => {
        if (pageResponse) {
            setPageData(pageResponse.data.page);
        }
    }, [pageResponse]);

    const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(
        null
    );
    // open mobile sidebar on select widget
    useEffect(() => {
        if (selectedWidget) {
            setInSidebarCollapsed(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWidget]);

    return (
        <InSidebarProvider initialCollapsed={true}>
            <div className="w-full flex items-start">
                <InSidebar>
                    {selectedWidget && <WidgetEditor widget={selectedWidget} />}

                    {!selectedWidget && pageData && (
                        <PageEditor pageData={pageData} />
                    )}
                </InSidebar>
                <div
                    id="main-content"
                    className={twMerge(
                        "w-full",
                        inSidebar.desktop.isCollapsed ? "lg:ml-16" : "lg:ml-64"
                    )}
                >
                    <PageContent
                        pageData={pageData}
                        onSelectWidget={setSelectedWidget}
                    />

                    <WidgetModal pageData={pageData} />
                </div>
            </div>
        </InSidebarProvider>
    );
};

export default PageEditPage;
