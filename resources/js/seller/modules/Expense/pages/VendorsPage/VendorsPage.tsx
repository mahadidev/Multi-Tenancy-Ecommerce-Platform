import useVendor from "@seller/_hooks/useVendor";
import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { FC } from "react";
import VendorsTable from "./VendorsTable";

const VendorsPage: FC = function () {
    useVendor();

    return (
        <>
            <div className="block items-center justify-between bg-white sm:flex dark:bg-gray-800">
                <PageBreadCrumb title="All Vendors" items={["Expense", "Vendors"]} />
            </div>
            <VendorsTable />
        </>
    );
};

export default VendorsPage;
