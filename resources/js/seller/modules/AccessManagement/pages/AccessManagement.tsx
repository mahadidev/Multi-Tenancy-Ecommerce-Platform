import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import React from "react";
import RolesTable from "./RolesTable/RolesTable";

const AccessManagementPage: React.FC = () => {
    return (
        <>
            <div className="block items-center justify-between bg-white sm:flex dark:bg-gray-800">
                <PageBreadCrumb
                    title="Access Management"
                    items={["Access Management"]}
                />
            </div>
            <div className="grid gap-5">
                <div className="my-5 rounded-lg">
                    <div className="block items-center justify-between bg-white p-4 sm:flex dark:bg-gray-800">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Role List
                        </h1>
                    </div>
                    <RolesTable />
                </div>
            </div>
        </>
    );
};

export default AccessManagementPage;
