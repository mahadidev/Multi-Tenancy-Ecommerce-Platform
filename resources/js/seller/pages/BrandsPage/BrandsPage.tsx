import useBrand from "@seller/hooks/useBrand";
import { RoutePath } from "@seller/seller_env";
import { useFetchBrandsQuery } from "@seller/store/reducers/brandApi";
import { Breadcrumb, Button, Label, TextInput } from "flowbite-react";
import { FC } from "react";
import { HiDocumentDownload, HiHome } from "react-icons/hi";
import BrandsTable from "./BrandsTable";
import BrandsTablePagination from "./BrandsTablePagination";
import CreateBrandModal from "./CreateBrandModal";

const BrandsPage: FC = function () {
    // fetch Brands
    useFetchBrandsQuery();
    const { meta } = useBrand();

    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 w-full">
                    <div className="mb-4">
                        <Breadcrumb className="mb-5">
                            <Breadcrumb.Item
                                href={RoutePath.DashboardPage.index()}
                            >
                                <div className="flex items-center gap-x-3">
                                    <HiHome className="text-xl" />
                                    <span>Dashboard</span>
                                </div>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Brand</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            All Brand
                        </h1>
                    </div>
                    <div className="sm:flex">
                        <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
                            <form className="lg:pr-3">
                                <Label
                                    htmlFor="Brand-search"
                                    className="sr-only"
                                >
                                    Search
                                </Label>
                                <div className="relative mt-1 lg:w-64 xl:w-96">
                                    <TextInput
                                        id="Brand-search"
                                        name="Brand-search"
                                        placeholder="Search for Brand"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                            <CreateBrandModal />
                            <Button className="p-0" color="gray">
                                <div className="flex items-center gap-x-3">
                                    <HiDocumentDownload className="text-xl" />
                                    <span>Export</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <BrandsTable />
                        </div>
                    </div>
                </div>
            </div>
            {meta && <BrandsTablePagination meta={meta} />}
        </>
    );
};

export default BrandsPage;
