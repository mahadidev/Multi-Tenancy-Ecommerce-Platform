import { DataTable } from "@seller/components";
import StatusBadge from "@seller/components/Badge/StatusBadge";
import useOrders from "@seller/hooks/useOrders";
import { OrderType } from "@type/orderType";
import { Button, Table } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import OrderInfoModal from "./OrderInfoModal";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";

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
                        label: "Customer Email",
                        key: "user_email",
                        render: (row: OrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.user?.email}
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
                        label: "Payment Method",
                        key: "payment_method",
                        render: (row: OrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.payment_method}
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
                        render: (row: OrderType) => (
                            <Table.Cell>
                                <div className="flex items-center gap-x-3 whitespace-nowrap">
                                    <UpdateOrderStatusModal order={row} />
                                    <OrderInfoModal order={row} />
                                </div>
                            </Table.Cell>
                        ),
                    },
                ]}
                search={{
                    placeholder: "Search for order...",
                    columns: [
                        "order_uuid",
                        "user_name",
                        "user_email",
                        "total",
                        "created_at",
                    ],
                }}
                head={{
                    render: () => (
                        <Button
                            as={Link}
                            to={`/orders/create`}
                            size="md"
                            color="primary"
                            className="p-0"
                        >
                            <div className="flex items-center gap-x-2">
                                <HiPlus className="h-5 w-5" />
                                Create Order
                            </div>
                        </Button>
                    ),
                }}
                data={orders!}
                exportable={true}
                filename="orders"
            />
        </>
    );
};
export default OrdersTable;
