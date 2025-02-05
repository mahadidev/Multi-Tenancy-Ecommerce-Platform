import useCategory from "@seller/hooks/useCategory";
import { RoutePath } from "@seller/seller_env";
import { Breadcrumb } from "flowbite-react";
import { FC } from "react";
import { HiHome } from "react-icons/hi";
import BlogCategoriesTable from "./BlogCategoriesTable";
import BlogCategoriesTablePagination from "./BlogCategoriesTablePagination";

const BlogCategories: FC = function () {
    const { blogCategoriesMeta } = useCategory();

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
                            <Breadcrumb.Item
                                href={`/seller${RoutePath.BlogsPage.index()}`}
                            >
                                <div className="flex items-center gap-x-3">
                                    <span>Blogs</span>
                                </div>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Category</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            All Blog Category
                        </h1>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <BlogCategoriesTable />
                        </div>
                    </div>
                </div>
            </div>
            {blogCategoriesMeta && (
                <BlogCategoriesTablePagination meta={blogCategoriesMeta} />
            )}
        </>
    );
};

export default BlogCategories;
