import { DataTable } from "@seller/components";
import useCategory from "@seller/hooks/useCategory";
import { CategoryType } from "@type/categoryType";
import { Checkbox, Label, Table } from "flowbite-react";
import CreateBlogCategoryModal from "./CreateBlogCategoryModal";
import DeleteBlogCategoryModal from "./DeleteBlogCategoryModal";
import EditBlogCategoryModal from "./EditBlogCategoryModal";

const BlogCategoriesTable = () => {
    // get the blog categories
    const { blogCategories } = useCategory();

    return (
        <>
            <DataTable
                columns={[
                    {
                        label: (
                            <>
                                {" "}
                                <Label htmlFor="select-all" className="sr-only">
                                    Select all
                                </Label>
                                <Checkbox id="select-all" name="select-all" />{" "}
                            </>
                        ),
                        key: "id",
                        render: () => (
                            <Table.Cell className="w-4 p-4">
                                <Checkbox
                                    aria-describedby="checkbox-1"
                                    id="checkbox-1"
                                />
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "ID",
                        key: "id",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.id}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Name",
                        key: "name",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Slug",
                        key: "slug",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.slug}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Parent",
                        key: "parent",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.has_parent?.name}
                            </Table.Cell>
                        ),
                        sortable: false,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: CategoryType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: CategoryType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <EditBlogCategoryModal category={row} />
                                    <DeleteBlogCategoryModal category={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for category",
                    columns: ["name", "slug", "parent", "created_at"],
                }}
                data={blogCategories}
                head={{
                    render: (_data: CategoryType[]) => (
                        <CreateBlogCategoryModal />
                    ),
                }}
                exportable={true}
                filename="blog_category"
            />
        </>
    );
};
export default BlogCategoriesTable;
