import { RoutePath } from "@seller/seller_env";
import { Breadcrumb } from "flowbite-react";
import React from "react";
import { HiHome } from "react-icons/hi";
import RolesTable from "./RolesTable/RolesTable";

const AccessManagementPage: React.FC = () => {
    return (
        <>
            <div className="block items-center justify-between bg-white p-4 sm:flex dark:bg-gray-800">
                <div className="w-full">
                    <div>
                        <Breadcrumb className="mb-5">
                            <Breadcrumb.Item
                                href={RoutePath.DashboardPage.index()}
                            >
                                <div className="flex items-center gap-x-3">
                                    <HiHome className="text-xl" />
                                    <span>Dashboard</span>
                                </div>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Access Management</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Access Management
                        </h1>
                    </div>
                </div>
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
