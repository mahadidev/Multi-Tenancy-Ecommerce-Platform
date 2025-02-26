import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import StoreAdminTable from "./StoreAdminTable";

const StoreAdminPage = () => {
    return (
        <>
            <div className="block items-center justify-between bg-white sm:flex dark:bg-gray-800">
                <PageBreadCrumb
                    title="Store Admin List"
                    items={["Store Admin"]}
                />
            </div>
            <StoreAdminTable />
        </>
    );
};

export default StoreAdminPage;
