import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { FC } from "react";
import CustomersTable from "./CustomersTable";

const CustomersPage: FC = function () {
    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white sm:flex dark:border-gray-700 dark:bg-gray-800"></div>
            <PageBreadCrumb title="All Customer" items={["Customers"]} />
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <CustomersTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomersPage;
