import { DataTable } from "@seller/components";
import useBlog from "@seller/hooks/useBlog";
import { BlogType } from "@type/blogType";
import "datatables.net";
import { Button, Checkbox, Label, Table } from "flowbite-react";
import "flowbite/dist/flowbite.css";
import { HiPencilAlt, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import DeleteBlogModal from "./DeleteBlogModal";
import PreviewPostModal from "./PreviewBlogModal";

const BlogsTable = () => {
    const { blogs } = useBlog();

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
                        render: (row: BlogType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.id}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Name",
                        key: "name",
                        render: (row: BlogType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.title}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Category",
                        key: "category",
                        render: (row: BlogType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.category?.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (row: BlogType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.status}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: BlogType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: BlogType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <PreviewPostModal blog={row} />
                                    <Button
                                        as={Link}
                                        to={`/blogs/${row?.id}`}
                                        size="sm"
                                        color="primary"
                                        className="p-0"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <HiPencilAlt className="h-5 w-5" />
                                            Edit Post
                                        </div>
                                    </Button>
                                    <DeleteBlogModal blog={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for brand",
                    columns: ["name", "category", "status", "created_at"],
                }}
                data={blogs}
                head={{
                    render: (_data: BlogType[]) => (
                        <Button
                            color="primary"
                            className="p-0"
                            as={Link}
                            to={`/blogs/create`}
                        >
                            <div className="flex items-center gap-x-3">
                                <HiPlus className="text-xl" />
                                Create Blog
                            </div>
                        </Button>
                    ),
                }}
                exportable={true}
            />
        </>
    );
};
export default BlogsTable;
