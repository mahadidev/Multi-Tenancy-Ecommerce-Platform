import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { FC } from "react";
import ProductsTable from "./ProductsTable";

const ProductsPage: FC = function () {
    // const { meta } = useProduct();

    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white sm:flex dark:border-gray-700 dark:bg-gray-800">
                <PageBreadCrumb title="All Product" items={["Product"]} />
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <ProductsTable />
                        </div>
                    </div>
                </div>
            </div>

            {/* {meta && <ProductsTablePagination meta={meta} />} */}
        </>
    );
};

export default ProductsPage;
