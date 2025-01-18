import usePage from "@/seller/hooks/usePage";
import { StorePageType } from "@/seller/types";

export default function PageEditor() {
    const { page, widget } = usePage();
    const pageData: StorePageType | null = page;

    return (
        <>
            {!widget && pageData && (
                <div>
                    <h1 className="p-2.5 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white text-center font-semibold">
                        Edit {pageData.name} page
                    </h1>
                </div>
            )}
        </>
    );
}
