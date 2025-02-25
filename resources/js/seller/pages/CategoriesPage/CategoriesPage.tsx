import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { FC } from "react";
import CategoriesTable from "./CategoriesTable";

const CategoriesPage: FC = () => {
    return (
        <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <PageBreadCrumb
                title="All Product Categories"
                items={["Category"]}
            />
            <div className="overflow-hidden shadow">
                <CategoriesTable />
            </div>
        </div>
    );
};

export default CategoriesPage;
