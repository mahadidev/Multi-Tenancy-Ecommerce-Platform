import GenericTable from "@seller/components/DataTable/GenericTable";
import { useCustomerTable } from "../hooks";
import type { Customer } from "../types";
import { Table } from "flowbite-react";
import CreateCustomerModal from "./CreateCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import { formatTableDate } from "@seller/_utils/dateUtils";

const CustomersTable = () => {
    // Get customers using the generic table hook
    const customerTable = useCustomerTable();

    return (
        <GenericTable
            table={customerTable}
            columns={[
                {
                    label: "Customer",
                    key: "name",
                    render: (row: Customer) => (
                        <Table.Cell className="p-4">
                            <div className="flex items-center space-x-3">
                                {row.image ? (
                                    <img 
                                        src={row.image} 
                                        alt={row.name} 
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                            {row.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                                        {row.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {row.email}
                                    </div>
                                </div>
                            </div>
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Contact",
                    key: "phone",
                    render: (row: Customer) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            <div>
                                <div className="font-semibold">{row.phone || "N/A"}</div>
                                {row.address && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                        {row.address}
                                    </div>
                                )}
                            </div>
                        </Table.Cell>
                    ),
                    sortable: false,
                },
                {
                    label: "Created At",
                    key: "created_at",
                    render: (row: Customer) => (
                        <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                            {formatTableDate(row.created_at)}
                        </Table.Cell>
                    ),
                    sortable: true,
                },
                {
                    label: "Actions",
                    render: (row: Customer) => (
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditCustomerModal customer={row} />
                                <DeleteCustomerModal customer={row} />
                            </div>
                        </Table.Cell>
                    ),
                },
            ]}
            search={{
                placeholder: "Search customers by name, email, or phone...",
                columns: ["name", "email", "phone", "address"],
            }}
            head={{
                render: (_data: Customer[]) => <CreateCustomerModal />,
            }}
            exportable={true}
            filename="customers"
            defaultSortBy="created_at"
            defaultSortOrder="desc"
            defaultPerPage={10}
        />
    );
};
export default CustomersTable;