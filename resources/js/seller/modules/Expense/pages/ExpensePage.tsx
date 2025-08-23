import useExpense from "@seller/_hooks/useExpense";
import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { RoutePath } from "@seller/seller_env";
import { Button } from "flowbite-react";
import { FC } from "react";
import { MdBusiness } from "react-icons/md";
import { Link } from "react-router-dom";
import ExpensesTable from "./ExpensesTable";

const ExpensePage: FC = function () {
    useExpense();

    return (
        <>
            <div className="block items-center justify-between bg-white p-4 sm:flex dark:bg-gray-800">
                <div className="mb-4 sm:mb-0">
                    <PageBreadCrumb title="All Expenses" items={["Expense"]} />
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        as={Link}
                        to={RoutePath.VendorsPage.index()}
                        color="info"
                        size="sm"
                    >
                        <MdBusiness className="mr-2 h-4 w-4" />
                        Manage Vendors
                    </Button>
                </div>
            </div>
            <ExpensesTable />
        </>
    );
};

export default ExpensePage;
