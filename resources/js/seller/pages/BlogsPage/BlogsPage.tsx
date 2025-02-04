import useBlog from "@seller/hooks/useBlog";
import { RoutePath } from "@seller/seller_env";
import "datatables.net";
import { Breadcrumb } from "flowbite-react";
import "flowbite/dist/flowbite.css";
import { FC } from "react";
import { HiHome } from "react-icons/hi";
import BlogsTable from "./BlogsTable";
import BlogsTablePagination from "./BlogsTablePagination";

const BlogsPage: FC = function () {
    // fetch Products
    const { meta } = useBlog();

    // useEffect(() => {
    //     // Initialize DataTable
    //     $(document).ready(function () {
    //         $("#example").DataTable();
    //     });
    // }, []);

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
                            <Breadcrumb.Item>Blog</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            All Blog
                        </h1>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <BlogsTable />
                            {/* <DataTable /> */}
                        </div>
                    </div>
                </div>
            </div>

            {meta && <BlogsTablePagination meta={meta} />}
        </>
    );
};

export default BlogsPage;
