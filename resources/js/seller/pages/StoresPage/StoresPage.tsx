import { RoutePath } from "@seller/seller_env";
import { Breadcrumb } from "flowbite-react";
import React from "react";
import { HiHome } from "react-icons/hi";
import StoresTable from "./StoresTable";

const StoresPage: React.FC = () => {
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
                            <Breadcrumb.Item>Stores</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            All Stores
                        </h1>
                    </div>
                </div>
            </div>
            <StoresTable />
        </>
    );
};

export default StoresPage;
