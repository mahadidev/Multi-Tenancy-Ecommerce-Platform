import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import React from "react";
import MenusTable from "./MenusTable";

const MenusPage: React.FC = () => {
    return (
        <>
            <div className="block items-center justify-between bg-white p-4 sm:flex dark:bg-gray-800">
                <div className="w-full">
                    <PageBreadCrumb title="All Menu" items={["Menus"]} />
                </div>
            </div>
            <MenusTable />
        </>
    );
};

export default MenusPage;
