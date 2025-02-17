import { DataTable } from "@seller/components";

import useStoreAdmin from "@seller/hooks/useStoreAdmin";
import { StoreAdminType } from "@type/storeAdminType";
import { Table } from "flowbite-react";
import CreateStoreAdminModal from "./CreateStoreAdminModal";
import DeleteStoreAdminModal from "./DeleteStoreAdminModal";
import EditStoreAdminModal from "./EditStoreAdminModal";

const StoreAdminTable = () => {
    const { admins } = useStoreAdmin();

    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Name",
                        key: "name",
                        render: (row: StoreAdminType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Email",
                        key: "email",
                        render: (row: StoreAdminType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.email}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Phone",
                        key: "phone",
                        render: (row: StoreAdminType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.phone || "N/A"}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Address",
                        key: "address",
                        render: (row: StoreAdminType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.address || "N/A"}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Role",
                        key: "role",
                        render: (row: StoreAdminType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.role?.[0]}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },

                    {
                        render: (row: StoreAdminType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <EditStoreAdminModal admin={row} />
                                    <DeleteStoreAdminModal admin={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for admins...",
                    columns: ["name", "email", "phone", "address"],
                }}
                data={admins}
                head={{
                    render: (_data: StoreAdminType[]) => (
                        <CreateStoreAdminModal />
                    ),
                }}
                exportable={true}
                filename="permissions"
            />
        </>
    );
};
export default StoreAdminTable;
