import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import React from "react";
import StoresTable from "./StoresTable";

const StoresPage: React.FC = () => {
    return (
        <>
            <div className="block items-center justify-between bg-white p-4 sm:flex dark:bg-gray-800">
                <PageBreadCrumb title="All Stores" items={["Stores"]} />
            </div>
            <StoresTable />
        </>
    );
};

export default StoresPage;
