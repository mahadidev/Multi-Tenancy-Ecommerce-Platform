import { DataTable } from "@seller/components";
import StatusBadge from "@seller/components/Badge/StatusBadge";
import useStore from "@seller/hooks/useStore";
import { StoreType } from "@type/storeType";
import { Button, Table } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";

const StoresTable = () => {
    const { stores, currentStore, switchStore } = useStore();
    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Name",
                        key: "name",
                        render: (row: StoreType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Slug",
                        key: "slug",
                        render: (row: StoreType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.slug}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Email",
                        key: "email",
                        render: (row: StoreType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.email || "N/A"}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Phone",
                        key: "phone",
                        render: (row: StoreType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.phone || "N/A"}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: StoreType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: StoreType) => (
                            <Table.Cell>
                                {currentStore?.id === row?.id ? (
                                    <StatusBadge status="Selected" />
                                ) : (
                                    <Button
                                        color="primary"
                                        onClick={() =>
                                            switchStore.submit({
                                                formData: {
                                                    store_id: row?.id,
                                                },
                                            })
                                        }
                                        isProcessing={switchStore.isLoading}
                                        disabled={switchStore.isLoading}
                                    >
                                        Switch
                                    </Button>
                                )}
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for store...",
                    columns: ["name", "slug", "created_at"],
                }}
                head={{
                    render: (_data: StoreType[]) => (
                        <Button
                            as={Link}
                            to={`/stores/create`}
                            size="sm"
                            color="primary"
                            className="p-0"
                        >
                            <div className="flex items-center gap-x-2">
                                <HiPlus className="h-5 w-5" />
                                Create Store
                            </div>
                        </Button>
                    ),
                }}
                data={stores!}
                exportable={true}
                filename="stores"
            />
        </>
    );
};
export default StoresTable;
