import EditorLayout from "@/seller/components/layouts/editorLayout/layout";
import AddNewWidgetModal from "./addNewWidgetModal";

const PageEditPage = () => {
    return (
        <EditorLayout
            sidebarChildren={
                <>
                    <div className="flex flex-col gap-2.5"></div>
                </>
            }
        >
            <>
                <div className="p-8">
                    <AddNewWidgetModal />
                </div>
            </>
        </EditorLayout>
    );
};

export default PageEditPage;
