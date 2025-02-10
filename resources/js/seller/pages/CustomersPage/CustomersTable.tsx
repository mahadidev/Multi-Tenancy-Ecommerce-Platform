import { DataTable } from "@seller/components";
import useCustomer from "@seller/hooks/useCustomer";
import { CustomerType } from "@type/customersType";
import { Table } from "flowbite-react";
import CreateCustomerModal from "./CreateCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";
import EditCustomerModal from "./EditCustomerModal";

const CustomersTable = () => {
    // customers
    const { customers } = useCustomer();

    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Name",
                        key: "name",
                        render: (row: CustomerType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Email",
                        key: "email",
                        render: (row: CustomerType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.email}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Address",
                        key: "address",
                        render: (row: CustomerType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.address || "N/A"}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Phone",
                        key: "phone",
                        render: (row: CustomerType) => (
                            <Table.Cell className="capitalize whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.phone || "N/A"}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: CustomerType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: (row: CustomerType) => (
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
                    placeholder: "Search for customer...",
                    columns: [
                        "name",
                        "email",
                        "phone",
                        "address",
                        "created_at",
                    ],
                }}
                head={{
                    render: (_data: CustomerType[]) => <CreateCustomerModal />,
                }}
                data={customers!}
                exportable={true}
                filename="customers"
            />
        </>
    );
};
export default CustomersTable;
