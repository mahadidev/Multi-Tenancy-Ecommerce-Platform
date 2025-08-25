import GenericTable from "@seller/components/DataTable/GenericTable";
import { useVendorTable } from "../../hooks";
import { VendorType } from "@type/vendorType";
import { Table } from "flowbite-react";
import CreateVendorModal from "./CreateVendorModal";
import DeleteVendorModal from "./DeleteVendorModal";
import EditVendorModal from "./EditVendorModal";

const VendorsTable = () => {
    // Get vendors using the generic table hook
    const vendorTable = useVendorTable();

    return (
        <GenericTable
            table={vendorTable}
            columns={[
                {
                    label: "Vendor",
                    key: "name",
                    render: (row: VendorType) => (
                        <Table.Cell className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-semibold text-white">
                                        {row.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                                        {row.name}
                                    </div>
                                    {row.contact_person && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            Contact: {row.contact_person}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Contact Info",
                    key: "phone",
                    render: (row: VendorType) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            <div>
                                <div className="font-semibold">{row.phone || '-'}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {row.email || '-'}
                                </div>
                            </div>
                        </Table.Cell>
                    ),
                    sortable: false,
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
                    sortable: false,
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
                    sortable: false,
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
                    render: (row: VendorType) => (
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditVendorModal vendor={row} />
                                <DeleteVendorModal vendor={row} />
                            </div>
                        </Table.Cell>
                    ),
                },
            ]}
            search={{
                placeholder: "Search vendors by name, email, or phone...",
                columns: ["name", "email", "phone", "contact_person"],
            }}
            head={{
                render: (_data: VendorType[]) => <CreateVendorModal />,
            }}
            exportable={true}
            filename="vendors"
            defaultSortBy="created_at"
            defaultSortOrder="desc"
            defaultPerPage={10}
        />
    );
};

export default VendorsTable;
