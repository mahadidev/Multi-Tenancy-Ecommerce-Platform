import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { useBrand } from "../hooks";
import { FC } from "react";
import BrandsTable from "./BrandsTable";

const BrandsPage: FC = function () {
    useBrand();

    return (
        <>
            <div className="block items-center justify-between bg-white sm:flex dark:bg-gray-800">
                <PageBreadCrumb title="All Brand" items={["Brand"]} />
            </div>
            <BrandsTable />
        </>
    );
};

export default BrandsPage;