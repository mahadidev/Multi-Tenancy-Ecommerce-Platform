import useBlog from "@seller/hooks/useBlog";
import { BlogType } from "@type/blogType";
import "datatables.net";
import { Button, Checkbox, Label, Table } from "flowbite-react";
import "flowbite/dist/flowbite.css";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import DeleteBlogModal from "./DeleteBlogModal";
import PreviewPostModal from "./PreviewBlogModal";

const BlogsTable = () => {
    const { blogs } = useBlog();

    return (
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <Table.Head
                className="bg-gray-100 dark:bg-gray-700"
                theme={{
                    cell: {
                        base: "p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400",
                    },
                }}
            >
                <Table.HeadCell className="p-4">
                    <Label htmlFor="select-all" className="sr-only">
                        Select all
                    </Label>
                    <Checkbox id="select-all" name="select-all" />
                </Table.HeadCell>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell />
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {blogs.map((blog: BlogType) => (
                    <Table.Row
                        key={blog.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Table.Cell className="w-4 p-4">
                            <Checkbox
                                aria-describedby="checkbox-1"
                                id="checkbox-1"
                            />
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {blog.id}
                        </Table.Cell>
                        <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                            <img
                                alt=""
                                src={blog.image}
                                className="w-10 h-10 rounded-full aspect-square object-cover"
                            />
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                <div className="text-base font-semibold text-gray-900 dark:text-white">
                                    {blog.title}
                                </div>
                            </div>
                        </Table.Cell>

                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {blog?.category?.name ?? "No Category"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {blog.status}
                        </Table.Cell>

                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <PreviewPostModal blog={blog} />
                                <Button
                                    as={Link}
                                    to={`/blogs/${blog.id}`}
                                    size="sm"
                                    color="primary"
                                    className="p-0"
                                >
                                    <div className="flex items-center gap-x-2">
                                        <HiPencilAlt className="h-5 w-5" />
                                        Edit Post
                                    </div>
                                </Button>
                                <DeleteBlogModal blog={blog} />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
export default BlogsTable;
