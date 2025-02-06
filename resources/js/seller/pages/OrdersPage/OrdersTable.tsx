import { DataTable } from "@seller/components";
import StatusBadge from "@seller/components/Badge/StatusBadge";
import useOrders from "@seller/hooks/useOrders";
import { OrderType } from "@type/orderType";
import { Button, Table } from "flowbite-react";
import { HiEye, HiPencilAlt } from "react-icons/hi";

const OrdersTable = () => {
    // get the orders
    const { orders } = useOrders();

    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Order uuid",
                        key: "order_uuid",
                        render: (row: OrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.order_uuid}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Customer Name",
                        key: "user_name",
                        render: (row: OrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.user?.name}
                            </Table.Cell>
                        ),
                        sortable: false,
                    },
                    {
                        label: "Total",
                        key: "total",
                        render: (row: OrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.total ?? 0.0}BDT
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (row: OrderType) => (
                            <Table.Cell className="capitalize whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                <StatusBadge status={row?.status} />
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: OrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        render: () => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <Button
                                        size="sm"
                                        color="primary"
                                        className="p-0"
                                        // onClick={() => setOpen(true)}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <HiPencilAlt className="h-5 w-5" />
                                            Edit Status
                                        </div>
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="dark"
                                        className="p-0"
                                        // onClick={() => setOpen(true)}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <HiEye className="h-5 w-5" />
                                            Order Info
                                        </div>
                                    </Button>
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for category",
                    columns: ["order_uuid", "user_name", "total", "created_at"],
                }}
                data={orders!}
                exportable={true}
                filename="orders"
            />
        </>
    );
};
export default OrdersTable;
