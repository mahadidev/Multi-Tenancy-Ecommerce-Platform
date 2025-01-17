import { RoutePath } from "@/seller/env";
import { useAppSelector } from "@/seller/store";
import { SELLER_PREFIX } from "@/seller/store/env";
import { useFetchPagesQuery } from "@/seller/store/reducers/pageApi";
import { Breadcrumb, Button, Checkbox, Table } from "flowbite-react";
import { HiHome, HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import AddPageModal from "./addModal";
import TableNavigation from "./tableNavigation";

const PagesPage = () => {
    const { currentStore: store } = useAppSelector((state) => state.store);
    const { data: pagesResponse } = useFetchPagesQuery(store.id);

    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 w-full">
                    <div className="mb-4">
                        <Breadcrumb className="mb-5">
                            <Breadcrumb.Item href={`${SELLER_PREFIX}`}>
                                <div className="flex items-center gap-x-3">
                                    <HiHome className="text-xl" />
                                    <span className="dark:text-white">
                                        Dashboard
                                    </span>
                                </div>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Pages</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            All pages
                        </h1>
                    </div>

                    <div className="block items-center sm:flex">
                        <div className="flex w-full items-center sm:justify-end">
                            <AddPageModal />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <Table
                                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
                                theme={{
                                    head: {
                                        base: "bg-gray-100 dark:bg-gray-700",
                                        cell: {
                                            base: "p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400",
                                        },
                                    },
                                    body: {
                                        cell: {
                                            base: "rounded-none",
                                        },
                                    },
                                }}
                            >
                                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                                    {" "}
                                    <Table.HeadCell>
                                        <span className="sr-only">
                                            Toggle selected
                                        </span>
                                        <Checkbox />
                                    </Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>Title</Table.HeadCell>
                                    <Table.HeadCell>Type</Table.HeadCell>
                                    <Table.HeadCell>Status</Table.HeadCell>
                                    <Table.HeadCell>Last Update</Table.HeadCell>
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {pagesResponse?.data.pages.map(
                                        (item: any, index: number) => (
                                            <Table.Row
                                                key={index}
                                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <Table.Cell className="w-4 p-4">
                                                    <Checkbox />
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    {item.name}
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    {item.title}
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    {item.type.label}
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    {item.is_active == 1
                                                        ? "Active"
                                                        : "Deactive"}
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    {item.updated_at}
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    <Button
                                                        className="w-max"
                                                        size="sm"
                                                        color="blue"
                                                        to={RoutePath.pages.edit(
                                                            item.id
                                                        )}
                                                        as={Link}
                                                    >
                                                        <HiPencilAlt className="mr-2 h-5 w-5" />
                                                        Edit Page
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <TableNavigation />
        </>
    );
};

export default PagesPage;
