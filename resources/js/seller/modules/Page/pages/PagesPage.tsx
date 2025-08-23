import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { useFetchPagesQuery } from "../store/pageApi";
import { FC } from "react";
import PagesTable from "./PagesTable";

const PagesPage: FC = function () {
    // fetch Pages
    useFetchPagesQuery();

    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white sm:flex dark:border-gray-700 dark:bg-gray-800">
                <PageBreadCrumb title="All Page" items={["Page"]} />
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <PagesTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PagesPage;
