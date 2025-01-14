import EditorLayout from "@/seller/components/layouts/editorLayout/layout";
import { useAppSelector } from "@/seller/store";
import {
    useFetchPageQuery,
    useUpdatePageMutation,
} from "@/seller/store/reducers/pageApi";
import { ThemeById } from "@/themes/env";
import { Button } from "flowbite-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AddNewWidgetModal from "./addNewWidgetModal";

const PageEditPage = () => {
    const params = useParams();
    const { id } = params;
    const { currentStore: store } = useAppSelector((state) => state.store);
    const { data: pageResponse } = useFetchPageQuery({
        pageId: id ? id : "0",
        storeId: store.id,
    });

    useEffect(() => {
        if (pageResponse) {
            console.log("pageResponse", pageResponse);
        }
    }, [pageResponse]);

    const [updatePage] = useUpdatePageMutation();

    const handleOnDeleteWidget = (widgetId: any) => {
        if (id) {
            const updatedData = {
                storeId: store.id,
                pageId: id,
                formData: {
                    ...pageResponse.data.page,
                    widgets: pageResponse.data.page.widgets.filter(
                        (item: any) => item.id !== widgetId
                    ),
                },
            };

            updatePage(updatedData);
        }
    };

    return (
        <EditorLayout
            sidebarChildren={
                <>
                    <div className="flex flex-col gap-4">
                        <div></div>
                    </div>
                </>
            }
        >
            <>
                <div className="p-8 flex flex-col gap-8">
                    <div>
                        {pageResponse?.data.page.widgets?.map(
                            (widget: any, index: number) => (
                                <div className="relative" key={index}>
                                    <div className="absolute top-0 right-0 flex gap-2.5 items-center pb-4 pl-4 pt-5 pr-5 bg-gray-100  dark:bg-gray-900 text-gray-700 dark:text-white rounded-bl-md shadow-xl">
                                        <Button
                                            color="blue"
                                            onClick={() =>
                                                handleOnDeleteWidget(widget.id)
                                            }
                                            size="xs"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="red"
                                            onClick={() =>
                                                handleOnDeleteWidget(widget.id)
                                            }
                                            size="xs"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                    {ThemeById(store.theme_id).component(
                                        widget
                                    )}
                                </div>
                            )
                        )}
                    </div>
                    <AddNewWidgetModal />
                </div>
            </>
        </EditorLayout>
    );
};

export default PageEditPage;
