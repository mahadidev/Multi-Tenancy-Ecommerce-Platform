import { DataTable } from "@seller/components";
import usePage from "@seller/hooks/usePage";
import { RoutePath } from "@seller/seller_env";
import { PageType } from "@type/pageType";
import { Button, Table } from "flowbite-react";
import { HiPencilAlt } from "react-icons/hi";
import CreatePageModal from "./CreatePageModal";
import DeletePageModal from "./DeletePageModal";

const PagesTable = () => {
    const { pages } = usePage();
    // <Table.HeadCell>ID</Table.HeadCell>
    // 			<Table.HeadCell>Title</Table.HeadCell>
    // 			<Table.HeadCell>Type</Table.HeadCell>
    // 			<Table.HeadCell>Name</Table.HeadCell>
    // 			<Table.HeadCell>Last Update</Table.HeadCell>
    // 			<Table.HeadCell>Created At</Table.HeadCell>
    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Title",
                        key: "title",
                        render: (row: PageType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.title}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Type",
                        key: "type",
                        render: (row: PageType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.type?.type}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Name",
                        key: "name",
                        render: (row: PageType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: PageType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Last Update",
                        key: "last_update",
                        render: (row: PageType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.updated_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: PageType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <Button
                                        href={RoutePath.StorePagesPage.editUrl(
                                            row?.id
                                        )}
                                        size="sm"
                                        color="primary"
                                        className="p-0"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <HiPencilAlt className="h-5 w-5" />
                                            Edit Page
                                        </div>
                                    </Button>
                                    <DeletePageModal page={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for brand...",
                    columns: ["title", "name", "created_at", "last_update"],
                }}
                data={pages}
                head={{
                    render: (_data: PageType[]) => <CreatePageModal />,
                }}
                exportable={true}
                filename="brands"
            />
        </>
    );
};
export default PagesTable;
