import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { FC } from "react";
import OrdersTable from "./OrdersTable";

const OrdersPage: FC = function () {
    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white sm:flex dark:border-gray-700 dark:bg-gray-800">
                <PageBreadCrumb title="All Orders" items={["Orders"]} />
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <OrdersTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrdersPage;
