import useVendor from "@seller/_hooks/useVendor";
import { DataTable } from "@seller/components";
import { VendorType } from "@type/vendorType";
import { Table } from "flowbite-react";
import CreateVendorModal from "./CreateVendorModal";
import DeleteVendorModal from "./DeleteVendorModal";
import EditVendorModal from "./EditVendorModal";

const VendorsTable = () => {
    const { vendors } = useVendor();

    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Name",
                        key: "name",
                        render: (row: VendorType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                <div>
                                    <div className="font-medium">{row.name}</div>
                                    {row.contact_person && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Contact: {row.contact_person}
                                        </div>
                                    )}
                                </div>
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Phone",
                        key: "phone",
                        render: (row: VendorType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.phone || '-'}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Email",
                        key: "email",
                        render: (row: VendorType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.email || '-'}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Address",
                        key: "address",
                        render: (row: VendorType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                <div className="max-w-xs truncate">
                                    {row.address || '-'}
                                </div>
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Description",
                        key: "description",
                        render: (row: VendorType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                <div className="max-w-xs truncate">
                                    {row.description || '-'}
                                </div>
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: VendorType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at_human}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Actions",
                        key: "actions",
                        render: (row: VendorType) => (
                            <Table.Cell className="whitespace-nowrap p-4">
                                <div className="flex items-center space-x-2">
                                    <EditVendorModal vendor={row} />
                                    <DeleteVendorModal vendor={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                data={vendors}
                head={{
                    render: () => <CreateVendorModal />,
                }}
            />
        </>
    );
};

export default VendorsTable;
